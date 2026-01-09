"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SigninSection from "@/app/auth/sections/SigninSection";
import SignupSection from "@/app/auth/sections/SignupSection";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { isIOS, isInStandaloneMode } from "@/libs/is-ios";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function AuthPage() {
  const [view, setView] = useState<"signin" | "signup">("signin");
  const { isInstallable, promptInstall } = useInstallPrompt();

  useRedirectIfAuthenticated();

  const [showIOSHint, setShowIOSHint] = useState(() => {
    if (typeof window === "undefined") return false;

    return (
      isIOS() &&
      !isInStandaloneMode() &&
      !localStorage.getItem("ios-install-hint")
    );
  });

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === "accepted") {
      localStorage.setItem("pwa-installed", "true");
    }
  };

  const dismissIOSHint = () => {
    localStorage.setItem("ios-install-hint", "true");
    setShowIOSHint(false);
  };

  return (
    <main className="flex flex-1 w-full min-h-dvh justify-center bg-secondary-theme-foreground/30">
      <div className="flex flex-1 flex-col gap-2 items-center justify-center bg-background border-l-2 border-ring/30 relative">
       
        {isInstallable && !localStorage.getItem("pwa-installed") && (
          <button
            onClick={handleInstall}
            className="absolute top-3 right-3 rounded-full bg-primary-theme px-3 py-1 text-[10px] font-bold text-white shadow"
          >
            Install App
          </button>
        )}

        {showIOSHint && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black/80 px-4 py-2 text-[10px] text-white shadow-lg">
            <div className="flex items-center gap-2">
              <span>
                Tambahkan ke Home Screen via <b>Share</b> →{" "}
                <b>Add to Home Screen</b>
              </span>
              <button
                onClick={dismissIOSHint}
                className="ml-2 font-bold opacity-70"
              >
                X
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full items-center justify-center py-10">
          <Image
            src="/icons/zonahotspot.png"
            alt="Zona Hotspot Logo"
            width={180}
            height={180}
            priority
            className="object-contain"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-6 w-full items-start px-8 py-2"
          >
            {view === "signin" ? (
              <SigninSection onSwitchView={() => setView("signup")} />
            ) : (
              <SignupSection onSwitchView={() => setView("signin")} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-2 w-full items-start justify-center">
          <h6 className="text-[10px] text-secondary-theme-foreground font-semibold tracking-widest">
            © 2025 Zonahotspot All rights reserved
          </h6>
        </div>
      </div>
    </main>
  );
}
