"use client";

import CursorSplashOverlay from "@/components/shared/CursorSplashOverlay";
import { useCursorSplash } from "@/hooks/useCursorSplash";

export default function GlobalCursorFx() {
  const cursorFx = useCursorSplash();
  return <CursorSplashOverlay {...cursorFx} />;
}
