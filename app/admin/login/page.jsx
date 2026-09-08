"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandMark from "@/components/common/BrandMark";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setSubmitting(false);
        return;
      }

      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ink-950 p-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_300px_at_70%_0%,rgba(34,211,238,0.22),transparent_55%)]" />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandMark />
          </div>
          <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-brand-600 mb-2">Control room</p>
          <h1 className="font-display text-2xl font-bold text-ink-900">Sign in to Plugo</h1>
          <p className="text-slate-500 text-sm mt-1">Manage catalog, COD orders, and messages</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="admin@plugo.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full mt-2">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
