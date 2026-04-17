export default function AboutPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] flex items-center justify-center bg-charcoal text-warm overflow-hidden">
        {/* ================= BACKGROUND GLOW ================= */}
        <div className="absolute inset-0 hero-overlay"></div>

        {/* ================= RANGOLI CIRCLE ================= */}
        <div className="absolute top-1/2 left-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="absolute inset-0 rounded-full border border-gold opacity-25"></div>
          <div className="absolute inset-[70px] rounded-full border border-gold opacity-20"></div>
          <div className="absolute inset-[140px] rounded-full border border-gold opacity-15"></div>
        </div>

        {/* ================= FLOATING RANGOLI DOTS ================= */}
        <div className="absolute top-[30%] left-[38%] w-2 h-2 bg-gold rounded-full opacity-40"></div>
        <div className="absolute top-[65%] left-[60%] w-2 h-2 bg-gold rounded-full opacity-30"></div>
        <div className="absolute top-[50%] left-[48%] w-1.5 h-1.5 bg-gold rounded-full opacity-30"></div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mt-16">
          {/* TITLE */}
          <h1 className="text-6xl md:text-7xl font-heading text-bronze tracking-wide">
            Avyakta
          </h1>

          {/* RANGOLI LINE */}
          <div className="mt-6 flex items-center gap-3 opacity-90">
            <div className="w-12 h-[1px] bg-gold"></div>
            <span className="text-gold text-sm tracking-[8px]">✦ ✧ ✦ ✧ ✦</span>
            <div className="w-12 h-[1px] bg-gold"></div>
          </div>

          {/* TAGLINE */}
          <p className="mt-6 text-lg md:text-xl text-olive font-accent italic">
            Where creativity comes alive ✨
          </p>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <div className="relative py-20 bg-warm">
        {/* Side ornaments */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-bronze rounded-full"></div>
          ))}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-bronze rounded-full"></div>
          ))}
        </div>

        <div className="section text-center">
          <p className="text-2xl md:text-3xl font-heading text-bronze leading-relaxed">
            A space for expression. <br />
            A stage for creativity. <br />A celebration of culture.
          </p>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="relative py-20 bg-[#EFE8DB]">
        <div className="section max-w-3xl text-center">
          <p className="text-lg text-muted leading-relaxed">
            Avyakta is the celebration club of PESU EC — a space where shared
            energy, creativity, and expression bring the campus together.
          </p>

          <p className="mt-6 text-lg text-muted leading-relaxed">
            It connects students across departments and backgrounds, creating
            moments where music, performance, ideas, and culture meet.
          </p>
        </div>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div className="relative py-20 bg-warm">
        <div className="section max-w-2xl text-center">
          <p className="text-xl md:text-2xl font-accent italic text-olive leading-relaxed">
            More than events —
            <br />
            it’s the excitement before the lights turn on,
            <br />
            the energy in the crowd,
            <br />
            the feeling of being part of something bigger.
          </p>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="relative py-20 bg-[#EFE8DB]">
        <div className="section grid md:grid-cols-3 gap-8 text-center">
          {[
            "A space for expression",
            "A stage for creativity",
            "A celebration of Indian culture and artistic themes",
          ].map((item, i) => (
            <div key={i} className="card hover:scale-[1.03]">
              <p className="text-lg text-bronze font-heading">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FINAL ================= */}
      <div className="relative py-20 bg-warm">
        <div className="section text-center">
          <p className="text-2xl font-heading text-bronze">Avyakta —</p>

          <p className="mt-2 text-xl font-accent italic text-olive">
            Where stories meet, and creativity comes alive ✨
          </p>
        </div>
      </div>
    </main>
  );
}
