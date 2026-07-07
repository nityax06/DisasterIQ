"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function SessionControl() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("Operator");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "Operator");
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-300">
      <ShieldCheck className="h-3.5 w-3.5 text-green-300" />
      <span className="max-w-[120px] truncate">{email}</span>
      <button
        onClick={logout}
        className="rounded-full border border-white/10 bg-black/30 p-1 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
        title="Logout"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
