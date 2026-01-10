"use client";
import { useEffect } from "react";
export default function LockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  return <>{children}</>;
}
