export default function Footer() {
  return (
    <footer className="bg-navy border-t border-cream/10 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gold" />
              ))}
            </div>
            <span className="font-extrabold text-xl text-cream">OpenDots</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 text-cream/60 text-sm font-semibold">
            <a href="#how-it-works" className="hover:text-gold transition-colors">How it works</a>
            <a href="#magic-moment" className="hover:text-gold transition-colors">Demo</a>
            <a href="#early-access" className="hover:text-gold transition-colors">Early Access</a>
          </nav>

          {/* Tagline */}
          <p className="text-cream/40 text-sm italic font-[Merriweather]">Feel the world around you</p>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 text-center">
          <p className="text-cream/30 text-sm">
            Built for every child who deserves to experience the world.
          </p>
          <p className="text-cream/20 text-xs mt-2">
            &copy; {new Date().getFullYear()} OpenDots. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
