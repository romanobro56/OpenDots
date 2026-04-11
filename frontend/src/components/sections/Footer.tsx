import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E4E6EB] py-12">
      <div className="max-w-[1220px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="OpenDots" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-[17px] text-navy">OpenDots</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 text-muted-foreground text-[14px] font-medium">
            <a href="#how-it-works" className="hover:text-coral transition-colors">How it works</a>
            <a href="#magic-moment" className="hover:text-coral transition-colors">Demo</a>
            <a href="#early-access" className="hover:text-coral transition-colors">Early Access</a>
          </nav>

          {/* Tagline */}
          <p className="text-muted-foreground/60 text-[13px] italic font-[Merriweather]">Feel the world around you</p>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E4E6EB] text-center">
          <p className="text-muted-foreground/60 text-[13px]">
            Built for every child who deserves to experience the world.
          </p>
          <p className="text-muted-foreground/40 text-[12px] mt-1.5">
            &copy; {new Date().getFullYear()} OpenDots. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
