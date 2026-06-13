"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SketchCard } from "@/components/sketch-card";
import { SketchButton } from "@/components/sketch-button";
import { GhostPurple } from "@/components/ghosts";
import { DoodleSparkle, DoodleStar } from "@/components/doodles";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check admin table
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!admin) {
      setError("This account is not an admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen notebook-bg flex items-center justify-center px-4 relative overflow-hidden">
      <DoodleSparkle className="absolute top-10 left-10 w-10 h-10 animate-wiggle" />
      <DoodleStar className="absolute bottom-10 right-10 w-8 h-8 animate-wiggle" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <GhostPurple className="w-16 h-20" />
        </div>
        <SketchCard className="bg-ghost-white">
          <h1 className="font-hand text-3xl font-bold text-center mb-1">GHOSTIQ Admin</h1>
          <p className="font-doodle text-sm text-center text-ink/60 mb-5">sign in to manage quests</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-ink rounded-xl p-3 font-doodle text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-electric-cyan"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-ink rounded-xl p-3 font-doodle text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-electric-cyan"
            />
            {error && <p className="font-doodle text-sm text-red-600">{error}</p>}
            <SketchButton type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </SketchButton>
          </form>
        </SketchCard>
      </motion.div>
    </main>
  );
}
