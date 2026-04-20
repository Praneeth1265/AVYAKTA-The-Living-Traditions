"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/members", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        // Show navbar when scrolling up (delta < -5) or at top
        if (currentY < 10) {
          setVisible(true);
          setScrolled(false);
        } else if (delta < -5) {
          setVisible(true);
          setScrolled(true);
        } else if (delta > 8) {
          // Hide navbar when scrolling down past threshold
          setVisible(false);
          setMobileOpen(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  if (pathname && mobileOpen) {
    setMobileOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={[
        "fixed left-0 right-0 top-0 z-50",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled
          ? "border-b border-[#C9A84C]/25 bg-[#1C1C1C]/90 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          : "border-b border-[#C9A84C]/10 bg-transparent",
      ].join(" ")}
    >
      {/* Gold accent line at bottom */}
      <div
        className={[
          "absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-40",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px] relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#C9A84C]/40 bg-white transition duration-300 group-hover:block">
            <Image
              src="/logo.png"
              alt="Avyakta Logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-[#C9A84C] text-2xl tracking-[4px]">
              Avyakta
            </span>
            <span className="font-body text-[9px] tracking-[5px] text-[#C9A84C]/40 uppercase mt-0.5">
              PESU EC · Celebration Club
            </span>
          </div>
        </Link>

        {/* Rangoli ornament — desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#C9A84C]/50 rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#C9A84C]/70 rounded-full" />
          <div className="w-1.5 h-1.5 bg-[#C9A84C]/50 rounded-full" />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "font-body text-[13px] tracking-[2.5px] uppercase transition-colors duration-300",
                  "relative no-underline",
                  "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-[#C9A84C]",
                  "after:transition-transform after:duration-300 after:origin-left",
                  pathname === href
                    ? "text-[#C9A84C] after:scale-x-100"
                    : "text-[#F5F0E8]/70 hover:text-[#C9A84C] after:scale-x-0 hover:after:scale-x-100",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] rounded-lg border border-[#C9A84C]/30 bg-[#1C1C1C]/40 transition-colors hover:bg-[#C9A84C]/10"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={[
              "block h-[2px] w-5 bg-[#C9A84C] rounded-full transition-all duration-300 origin-center",
              mobileOpen ? "translate-y-[7px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-[2px] w-5 bg-[#C9A84C] rounded-full transition-all duration-300",
              mobileOpen ? "opacity-0 scale-x-0" : "opacity-100",
            ].join(" ")}
          />
          <span
            className={[
              "block h-[2px] w-5 bg-[#C9A84C] rounded-full transition-all duration-300 origin-center",
              mobileOpen ? "-translate-y-[7px] -rotate-45" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "border-t border-[#C9A84C]/15 bg-[#1C1C1C]/95 backdrop-blur-xl",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-t-0",
        ].join(" ")}
      >
        <ul className="flex flex-col py-4 px-6 gap-1 list-none m-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "block py-3 px-4 rounded-xl font-body text-[13px] tracking-[2.5px] uppercase transition-all duration-200 no-underline",
                  pathname === href
                    ? "text-[#C9A84C] bg-[#C9A84C]/10"
                    : "text-[#F5F0E8]/70 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5",
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
