-- GHOSTIQ WORLD - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- USERS TABLE
-- ============================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  wallet_address text,
  comment_link text,
  referral_code text unique not null,
  referred_by text references public.users(referral_code) on delete set null,
  reward_points integer default 0,
  task_follow boolean default false,
  task_like_repost boolean default false,
  task_comment_tag boolean default false,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create index if not exists idx_users_referral_code on public.users(referral_code);
create index if not exists idx_users_referred_by on public.users(referred_by);
create index if not exists idx_users_wallet on public.users(wallet_address);
create index if not exists idx_users_status on public.users(status);

-- ============================================
-- REFERRALS TABLE
-- ============================================
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.users(id) on delete cascade,
  referred_user_id uuid references public.users(id) on delete cascade,
  visit_count integer default 0,
  conversion_status text default 'visited' check (conversion_status in ('visited', 'converted')),
  created_at timestamptz default now()
);

create index if not exists idx_referrals_referrer on public.referrals(referrer_id);
create index if not exists idx_referrals_referred_user on public.referrals(referred_user_id);

-- ============================================
-- ADMINS TABLE (linked to Supabase Auth)
-- ============================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update reward points & referral conversion when a new user is approved/referred
create or replace function public.handle_new_referral()
returns trigger as $$
begin
  if new.referred_by is not null then
    -- increment referrer reward points
    update public.users
    set reward_points = reward_points + 10
    where referral_code = new.referred_by;

    -- insert referral record
    insert into public.referrals (referrer_id, referred_user_id, conversion_status)
    select u.id, new.id, 'converted'
    from public.users u
    where u.referral_code = new.referred_by;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_new_referral on public.users;
create trigger trg_new_referral
  after insert on public.users
  for each row execute function public.handle_new_referral();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.users enable row level security;
alter table public.referrals enable row level security;
alter table public.admins enable row level security;

-- USERS: anyone can insert their own quest submission
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (true);

-- USERS: anyone can read minimal data for referral stats / leaderboard
drop policy if exists "users_select_public" on public.users;
create policy "users_select_public" on public.users
  for select using (true);

-- USERS: users can update their own row (matched by username from client using service role for sensitive ops instead)
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (true);

-- ADMINS full access via service role only (no public policy = blocked for anon on writes)
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self" on public.admins
  for select using (auth.uid() = id);

-- REFERRALS: public read for stats
drop policy if exists "referrals_select_public" on public.referrals;
create policy "referrals_select_public" on public.referrals
  for select using (true);

drop policy if exists "referrals_insert_public" on public.referrals;
create policy "referrals_insert_public" on public.referrals
  for insert with check (true);

-- Admin override policies (admin email check via JWT)
drop policy if exists "admins_full_access_users" on public.users;
create policy "admins_full_access_users" on public.users
  for all using (
    exists (select 1 from public.admins where id = auth.uid())
  );

drop policy if exists "admins_full_access_referrals" on public.referrals;
create policy "admins_full_access_referrals" on public.referrals
  for all using (
    exists (select 1 from public.admins where id = auth.uid())
  );
