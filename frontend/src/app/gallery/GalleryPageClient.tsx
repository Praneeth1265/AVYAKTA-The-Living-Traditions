"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryEvent } from "@/lib/data/gallery";

type GalleryPageClientProps = {
  initialEvents: GalleryEvent[];
};

const PAGE_SIZE = 8;

function JaaliOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(28,28,28,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28,28,28,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(12,8,5,0.58) 0%, rgba(12,8,5,0.78) 100%)",
        backgroundSize: "12px 12px, 12px 12px, cover",
      }}
      aria-hidden
    />
  );
}

export default function GalleryPageClient({ initialEvents }: GalleryPageClientProps) {
  const [activeEventId, setActiveEventId] = useState(initialEvents[0]?.id ?? "");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function activateEvent(eventId: string) {
    setActiveEventId(eventId);
    setVisibleCount(PAGE_SIZE);
    setLightboxIndex(null);
  }

  const activeEvent = useMemo(
    () => initialEvents.find((event) => event.id === activeEventId) ?? initialEvents[0],
    [activeEventId, initialEvents],
  );

  const visibleImages = useMemo(
    () => (activeEvent ? activeEvent.images.slice(0, visibleCount) : []),
    [activeEvent, visibleCount],
  );

  useEffect(() => {
    if (lightboxIndex === null || !activeEvent) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => {
          if (current === null) {
            return current;
          }
          return (current + 1) % activeEvent.images.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => {
          if (current === null) {
            return current;
          }
          return current === 0 ? activeEvent.images.length - 1 : current - 1;
        });
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [lightboxIndex, activeEvent]);

  if (!activeEvent) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] px-6 py-20 text-[#1C1C1C]">
        <p className="mx-auto max-w-3xl rounded-xl border border-[#C9A84C]/50 bg-white p-8 text-center">
          Gallery is being curated. Please check back soon.
        </p>
      </main>
    );
  }

  const canLoadMore = visibleCount < activeEvent.images.length;
  const selectedImage = lightboxIndex !== null ? activeEvent.images[lightboxIndex] : null;

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1C1C]">
      <section className="relative overflow-hidden border-b border-[#C9A84C]/40 bg-[#1C1C1C] px-6 py-14 text-[#F5F0E8] md:px-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(201,168,76,0.35), transparent 36%), radial-gradient(circle at 84% 8%, rgba(139,26,26,0.28), transparent 34%), linear-gradient(135deg, #150F0A 0%, #2A1710 42%, #13110F 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C]">Gallery</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">Avyakta Frames Archive</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#F5F0E8]/84 md:text-base">
            Browse each event timeline through curated visual moments. Select an event on the left and explore the masonry wall on the right.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[290px_minmax(0,1fr)] md:px-8">
        <aside className="rounded-2xl border border-[#C9A84C]/40 bg-white p-3 shadow-[0_10px_24px_rgba(20,14,10,0.08)]">
          <p className="px-2 pb-2 pt-1 text-xs uppercase tracking-[0.16em] text-[#737955]">Events</p>
          <div className="max-h-[68vh] space-y-2 overflow-y-auto pr-1">
            {initialEvents.map((event) => {
              const isActive = event.id === activeEvent.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => activateEvent(event.id)}
                  className={`group w-full rounded-xl border border-transparent bg-[#F8F3E9] p-2 text-left transition hover:border-[#C9A84C]/45 ${
                    isActive ? "border-[#C9A84C] bg-[#FFF8E7]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-lg">
                      <img src={event.thumbnail} alt={event.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className={`min-w-0 border-l-4 pl-3 ${isActive ? "border-[#92791B]" : "border-transparent"}`}>
                      <p className="truncate text-sm font-semibold text-[#1C1C1C]">{event.name}</p>
                      <p className="text-xs uppercase tracking-[0.08em] text-[#737955]">{event.year}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-2xl border border-[#C9A84C]/40 bg-white p-4 shadow-[0_10px_24px_rgba(20,14,10,0.08)] md:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#92791B] md:text-3xl">{activeEvent.name}</h2>
              <p className="text-sm text-[#737955]">{activeEvent.images.length} images</p>
            </div>
          </div>

          <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {visibleImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-[#C9A84C]/40 bg-[#EDE3D2]"
              >
                <img src={image.url} alt={image.name} className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
                <JaaliOverlay />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/82 to-transparent px-3 pb-3 pt-10 text-left text-xs text-[#F5F0E8] transition-transform duration-300 group-hover:translate-y-0">
                  {image.name}
                </div>
              </button>
            ))}
          </div>

          {canLoadMore && (
            <div className="mt-2 flex justify-center pb-2 pt-4">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full border border-[#92791B] bg-[#92791B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7D6918]"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/88 p-3 md:p-8">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 h-10 w-10 rounded-full border border-[#C9A84C] bg-[#1C1C1C] text-[#F5F0E8] transition hover:bg-[#2D2119]"
            aria-label="Close"
          >
            X
          </button>

          <button
            type="button"
            onClick={() =>
              setLightboxIndex((current) => {
                if (current === null) {
                  return current;
                }
                return current === 0 ? activeEvent.images.length - 1 : current - 1;
              })
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-[#C9A84C]/70 bg-[#1C1C1C]/90 px-4 py-2 text-[#F5F0E8]"
            aria-label="Previous"
          >
            ←
          </button>

          <figure className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-xl border border-[#C9A84C]/60 bg-[#121212]">
            <img src={selectedImage.url} alt={selectedImage.name} className="max-h-[82vh] w-auto max-w-[95vw] object-contain" />
            <figcaption className="border-t border-[#C9A84C]/40 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F5F0E8]/88">
              {selectedImage.name}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() =>
              setLightboxIndex((current) => {
                if (current === null) {
                  return current;
                }
                return (current + 1) % activeEvent.images.length;
              })
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-[#C9A84C]/70 bg-[#1C1C1C]/90 px-4 py-2 text-[#F5F0E8]"
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}
