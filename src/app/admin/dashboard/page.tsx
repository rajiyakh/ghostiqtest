"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SketchCard } from "@/components/sketch-card";
import { SketchButton } from "@/components/sketch-button";
import { GhostWink } from "@/components/ghosts";
import { DoodleSparkle, DoodleCheck, DoodleZigzag } from "@/components/doodles";
import { Download, Search, LogOut, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type UserRow = {
  id: string;
  username: string;
  wallet_address: string;
  comment_link: string;
  referral_code: string;
  referred_by: string | null;
  reward_points: number;
  status: string;
  task_follow: boolean;
  task_like_repost: boolean;
  task_comment_tag: boolean;
  created_at: string;
};

type Analytics = {
  totals: { total: number; pending: number; approved: number; rejected: number };
  topReferrers: { username: string; referral_code: string; reward_points: number }[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("username");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checking, setChecking] = useState(true);

  // Verify admin session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
        return;
      }
      supabase
        .from("admins")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle()
        .then(({ data: admin }) => {
          if (!admin) {
            router.push("/admin/login");
          } else {
            setChecking(false);
          }
        });
    });
  }, [router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "20");
    if (search) {
      params.set("search", search);
      params.set("searchType", searchType);
    }
    if (status) params.set("status", status);

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [page, search, searchType, status]);

  const fetchAnalytics = useCallback(async () => {
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    if (res.ok) setAnalytics(data);
  }, []);

  useEffect(() => {
    if (!checking) {
      fetchUsers();
      fetchAnalytics();
    }
  }, [checking, fetchUsers, fetchAnalytics]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchUsers();
    fetchAnalytics();
  }

  async function handleExport() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/export?${params.toString()}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ghostiq-participants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  if (checking) {
    return (
      <main className="min-h-screen notebook-bg flex items-center justify-center">
        <GhostWink className="w-16 h-20 animate-bounce-sm" />
      </main>
    );
  }

  return (
    <main className="min-h-screen notebook-bg pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GhostWink className="w-10 h-12" color="#C6F432" />
            <h1 className="font-hand text-3xl sm:text-4xl font-bold text-ink">Admin Dashboard</h1>
            <DoodleSparkle className="w-7 h-7 animate-wiggle" />
          </div>
          <SketchButton variant="dark" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={14} /> Logout
          </SketchButton>
        </div>

        {/* Analytics */}
        {analytics && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SketchCard className="bg-electric-cyan/20 text-center py-4">
              <div className="font-hand text-3xl font-bold">{analytics.totals.total}</div>
              <div className="font-doodle text-xs text-ink/60 mt-1">Total Participants</div>
            </SketchCard>
            <SketchCard className="bg-soft-purple/20 text-center py-4">
              <div className="font-hand text-3xl font-bold">{analytics.totals.pending}</div>
              <div className="font-doodle text-xs text-ink/60 mt-1">Pending</div>
            </SketchCard>
            <SketchCard className="bg-neon-lime/20 text-center py-4">
              <div className="font-hand text-3xl font-bold">{analytics.totals.approved}</div>
              <div className="font-doodle text-xs text-ink/60 mt-1">Approved</div>
            </SketchCard>
            <SketchCard className="bg-red-100 text-center py-4">
              <div className="font-hand text-3xl font-bold">{analytics.totals.rejected}</div>
              <div className="font-doodle text-xs text-ink/60 mt-1">Rejected</div>
            </SketchCard>
          </motion.div>
        )}

        {/* Top referrers */}
        {analytics && analytics.topReferrers.length > 0 && (
          <SketchCard className="mb-6 bg-ghost-white">
            <div className="flex items-center gap-2 mb-3">
              <DoodleZigzag className="w-12 h-4" />
              <h3 className="font-hand text-2xl font-bold">Top Referrers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-doodle text-sm">
                <thead>
                  <tr className="text-left text-ink/60 border-b-2 border-dashed border-ink/20">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Username</th>
                    <th className="py-2 pr-4">Referral Code</th>
                    <th className="py-2 pr-4">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topReferrers.map((r, i) => (
                    <tr key={r.referral_code} className="border-b border-dashed border-ink/10">
                      <td className="py-2 pr-4">{i + 1}</td>
                      <td className="py-2 pr-4">@{r.username}</td>
                      <td className="py-2 pr-4">{r.referral_code}</td>
                      <td className="py-2 pr-4 font-bold">{r.reward_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SketchCard>
        )}

        {/* Search & filters */}
        <SketchCard className="mb-4 bg-ghost-white">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search size={16} className="text-ink/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 border-2 border-ink rounded-xl p-2 font-doodle text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-electric-cyan"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border-2 border-ink rounded-xl p-2 font-doodle text-sm bg-cream focus:outline-none"
            >
              <option value="username">Username</option>
              <option value="wallet">Wallet</option>
              <option value="referral_code">Referral Code</option>
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="border-2 border-ink rounded-xl p-2 font-doodle text-sm bg-cream focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <SketchButton type="submit" variant="secondary" size="sm">
              Search
            </SketchButton>
            <SketchButton type="button" variant="dark" size="sm" onClick={handleExport} className="flex items-center gap-2">
              <Download size={14} /> Export CSV
            </SketchButton>
          </form>
        </SketchCard>

        {/* Users table */}
        <SketchCard className="bg-ghost-white overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-10">
              <GhostWink className="w-12 h-16 animate-bounce-sm" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center font-doodle text-ink/60 py-10">No participants found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-doodle text-sm">
                <thead>
                  <tr className="text-left text-ink/60 border-b-2 border-dashed border-ink/20">
                    <th className="py-2 pr-4">Username</th>
                    <th className="py-2 pr-4">Wallet</th>
                    <th className="py-2 pr-4">Referral</th>
                    <th className="py-2 pr-4">Tasks</th>
                    <th className="py-2 pr-4">Points</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-dashed border-ink/10 align-top">
                      <td className="py-3 pr-4">
                        <div className="font-bold">@{u.username}</div>
                        {u.comment_link && (
                          <a href={u.comment_link} target="_blank" rel="noopener noreferrer" className="text-electric-cyan text-xs flex items-center gap-1 mt-1">
                            comment <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-xs">
                        {u.wallet_address ? `${u.wallet_address.slice(0, 6)}...${u.wallet_address.slice(-4)}` : "-"}
                      </td>
                      <td className="py-3 pr-4 text-xs">
                        <div>{u.referral_code}</div>
                        {u.referred_by && <div className="text-ink/50">via {u.referred_by}</div>}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-1">
                          {u.task_follow && <DoodleCheck className="w-5 h-5" />}
                          {u.task_like_repost && <DoodleCheck className="w-5 h-5" />}
                          {u.task_comment_tag && <DoodleCheck className="w-5 h-5" />}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-bold">{u.reward_points}</td>
                      <td className="py-3 pr-4 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border-2 border-ink ${
                            u.status === "approved" ? "bg-neon-lime" : u.status === "rejected" ? "bg-red-200" : "bg-soft-purple/40"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          {u.status !== "approved" && (
                            <button onClick={() => updateStatus(u.id, "approved")} className="text-xs px-2 py-1 rounded-lg border-2 border-ink bg-neon-lime hover:translate-y-[1px]">
                              Approve
                            </button>
                          )}
                          {u.status !== "rejected" && (
                            <button onClick={() => updateStatus(u.id, "rejected")} className="text-xs px-2 py-1 rounded-lg border-2 border-ink bg-red-200 hover:translate-y-[1px]">
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t-2 border-dashed border-ink/20">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border-2 border-ink bg-cream disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-doodle text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border-2 border-ink bg-cream disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </SketchCard>
      </div>
    </main>
  );
}
