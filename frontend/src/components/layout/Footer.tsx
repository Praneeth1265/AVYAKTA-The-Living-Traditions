import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-gold/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(201,168,76,0.15) 1.5px, transparent 1.5px), radial-gradient(rgba(146,121,27,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px, 60px 60px",
        }}
      />

      {/* Main columns */}
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-4 gap-12 py-14 relative z-10 items-start">
        {/* Logo */}
        <div className="flex flex-col items-start">
          <Image
            src="/logo.png"
            alt="Avyakta Logo"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        {/* About Us */}
        <div>
          <p className="font-heading text-gold text-lg tracking-[4px] uppercase mb-4">
            About Us
          </p>
          <div className="h-px bg-gold/20 mb-5" />
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {[
              { label: "Mission", href: "/about#mission" },
              { label: "Vision", href: "/about#vision" },
              { label: "History", href: "/history" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="font-body text-sm text-warm/50 hover:text-gold transition-colors duration-300 flex items-center gap-2 no-underline group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold/30 group-hover:bg-gold transition-colors duration-300" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div>
          <p className="font-heading text-gold text-lg tracking-[4px] uppercase mb-4">
            Explore
          </p>
          <div className="h-px bg-gold/20 mb-5" />
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {[
              { label: "Recruitment", href: "/recruitment" },
              { label: "Events", href: "/events" },
              { label: "Gallery", href: "/gallery" },
              { label: "Registrations", href: "/registrations" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="font-body text-sm text-warm/50 hover:text-gold transition-colors duration-300 flex items-center gap-2 no-underline group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold/30 group-hover:bg-gold transition-colors duration-300" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-heading text-gold text-lg tracking-[4px] uppercase mb-4">
            Contact
          </p>
          <div className="h-px bg-gold/20 mb-5" />
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {[
              { label: "Instagram", href: "https://instagram.com" },
              { label: "Email Us", href: "mailto:avyakta@pesu.edu" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-warm/50 hover:text-gold transition-colors duration-300 flex items-center gap-2 no-underline group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold/30 group-hover:bg-gold transition-colors duration-300" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ornament divider */}
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="h-px bg-gold/15" />
        <div className="text-center text-xs tracking-[8px] text-gold/30 -mt-3 relative z-10">
          <span className="bg-charcoal px-4">{"✦  ✧  ✦  ✧  ✦"}</span>
        </div>
        <div className="h-px bg-gold/15 mt-3" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between py-6 relative z-10">
        <p className="font-body text-xs text-warm/25 tracking-wide">
          {"© 2025 Avyakta · PESU EC · All rights reserved"}
        </p>
        <p className="font-accent italic text-xs text-gold/30 tracking-wide">
          {"The Wholeness in Becoming"}
        </p>
      </div>
    </footer>
  );
}
