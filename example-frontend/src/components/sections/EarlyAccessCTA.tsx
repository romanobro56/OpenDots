import { useState } from "react";
import { API, type WaitlistPayload } from "@/config/api";

const roles = ["Parent", "Teacher", "Therapist", "School Administrator", "Other"];

const EarlyAccessCTA = () => {
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
      const payload: WaitlistPayload = { first_name: firstName.trim(), email: email.trim(), role };
      const res = await fetch(API.waitlist, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="absolute inset-0 dot-grid-bg opacity-20" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-cream mb-4">
            Be among the <span className="text-gold">first</span>
          </h2>
          <p className="text-cream/70 text-lg mb-12">
            OpenDots is currently in development. Join our early access list and help us put it in the hands of children who need it most.
          </p>

          {success ? (
            <div className="bg-cream/10 rounded-3xl p-10 border border-gold/30">
              <div className="flex justify-center mb-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-4 h-4 rounded-full bg-gold mx-1 animate-glow-pulse" style={{ animationDelay: `${i*200}ms` }} />
                ))}
              </div>
              <p className="font-display font-bold text-2xl text-gold mb-2">You're on the list.</p>
              <p className="text-cream/70">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 font-semibold focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 font-semibold focus:outline-none focus:border-gold transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-cream/10 border border-cream/20 text-cream font-semibold focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="" disabled className="text-navy">I am a...</option>
                {roles.map((r) => (
                  <option key={r} value={r} className="text-navy">{r}</option>
                ))}
              </select>

              {error && (
                <p className="text-coral font-semibold text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 rounded-full bg-coral text-cream font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join early access"}
              </button>
            </form>
          )}

          <p className="mt-8 text-cream/50 text-sm italic">
            Every child deserves to experience the world — on their own terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccessCTA;
