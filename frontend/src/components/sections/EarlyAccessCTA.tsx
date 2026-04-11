"use client";

import { useState } from "react";

const roles = ["Parent", "Teacher", "Therapist", "School Administrator", "Other"];

export default function EarlyAccessCTA() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !email.trim() || !role) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName.trim(), email: email.trim(), role }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="early-access" className="bg-navy py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-bg opacity-15" />
      <div className="max-w-[1220px] relative z-10 mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-white mb-4">
            Be among the <span className="text-coral">first</span>
          </h2>
          <p className="text-white/60 text-[17px] mb-12 leading-relaxed">
            OpenDots is currently in development. Join our early access list and help us put it in the hands of children who need it most.
          </p>

          {success ? (
            <div className="bg-white/5 rounded-2xl p-10 border border-white/10">
              <div className="flex justify-center mb-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-4 h-4 rounded-full bg-coral mx-1 animate-glow-pulse" style={{ animationDelay: `${i*200}ms` }} />
                ))}
              </div>
              <p className="font-bold text-[22px] text-white mb-2">You&apos;re on the list.</p>
              <p className="text-white/60">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/35 font-medium text-[15px] focus:outline-none focus:border-coral/60 transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/35 font-medium text-[15px] focus:outline-none focus:border-coral/60 transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-[15px] focus:outline-none focus:border-coral/60 transition-colors appearance-none"
              >
                <option value="" disabled className="text-navy">I am a...</option>
                {roles.map((r) => (
                  <option key={r} value={r} className="text-navy">{r}</option>
                ))}
              </select>

              {error && (
                <p className="text-[#E34F4F] font-medium text-[14px]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 rounded-xl bg-coral text-white font-semibold text-[16px] hover:bg-[#0559D4] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Joining..." : "Join early access"}
              </button>
            </form>
          )}

          <p className="mt-8 text-white/35 text-[14px] italic font-[Merriweather]">
            Every child deserves to experience the world — on their own terms.
          </p>
        </div>
      </div>
    </section>
  );
}
