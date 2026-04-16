"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-charcoal sticky top-0 z-50 relative overflow-hidden border-b border-gold/30">
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px] relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/logo.png"
            alt="Avyakta Logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-gold text-2xl tracking-[4px]">
              Avyakta
            </span>
            <span className="font-body text-[9px] tracking-[5px] text-gold/40 uppercase mt-0.5">
              PESU EC · Celebration Club
            </span>
          </div>
        </Link>

        {/* Rangoli ornament */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gold/50 rounded-full" />
          <div className="w-2.5 h-2.5 bg-gold/70 rounded-full" />
          <div className="w-1.5 h-1.5 bg-gold/50 rounded-full" />
        </div>

        {/* Links */}
        <ul className="flex items-center gap-9 list-none m-0 p-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "font-body text-[13px] tracking-[2.5px] uppercase transition-colors duration-300",
                  "relative no-underline",
                  "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-gold",
                  "after:transition-transform after:duration-300 after:origin-left",
                  pathname === href
                    ? "text-gold after:scale-x-100"
                    : "text-warm/70 hover:text-gold after:scale-x-0 hover:after:scale-x-100",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
