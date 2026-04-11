"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/" },
  { label: "File Upload", href: "/upload" },
  { label: "Model View", href: "/model-view" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-[#E4E6EB] sticky top-0 z-50">
      <div className="max-w-[1220px] mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.png" alt="OpenDots" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[17px] text-navy tracking-tight">
            OpenDots
          </span>
        </Link>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-4 py-2 text-[14px] font-semibold tracking-[0.01em] transition-colors rounded-lg ${
                  isActive
                    ? "text-coral bg-coral/8"
                    : "text-muted-foreground hover:text-navy hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

          {/* CTA button */}
          <Link
            href="#early-access"
            className="ml-3 px-4 py-2 bg-coral text-white text-[14px] font-semibold rounded-lg hover:bg-[#0559D4] transition-colors"
          >
            Get Early Access
          </Link>
        </nav>
      </div>
    </header>
  );
}
