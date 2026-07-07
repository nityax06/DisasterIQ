"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Radio, LockKeyhole } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check email confirmation if Supabase requires it.");
      return;
    }

    router.replace("/");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_32%),linear-gradient(135deg,#020617,#000,#020617)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-between gap-10 px-6 py-10">
        <div className="hidden max-w-xl lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-300">
            <Radio className="h-3.5 w-3.5" /> Secure Emergency Operations Console
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            Disaster<span className="text-slate-300">IQ</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400">
            Authenticated access for incident monitoring, resource allocation,
            AI-powered response recommendations, live weather intelligence and
            command-center decision support.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            {["Supabase Auth", "AI Assistant", "Weather Intelligence", "Live Map Operations"].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <ShieldCheck className="mb-3 h-4 w-4 text-green-300" />
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-slate-500">Enabled for v1.0 operations.</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <LockKeyhole className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Operator Login</h2>
              <p className="text-xs text-slate-500">Secure access to DisasterIQ.</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-green-500/40"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-green-500/40"
            />
          </div>

          {message && (
            <p className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-slate-200 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Enter Dashboard" : "Create Operator Account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-slate-400 transition hover:text-white"
          >
            {mode === "login" ? "Need an account? Create one" : "Already have an account? Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
