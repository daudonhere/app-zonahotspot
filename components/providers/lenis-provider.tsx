"use client";
import { useEffect } from "react";
import Lenis from "lenis";
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const lenis = new Lenis({
      duration: isMobile ? 2.2 : 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      wheelMultiplier: isMobile ? 0.45 : 0.65,
      touchMultiplier: isMobile ? 0.6 : 0.8,
    });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
