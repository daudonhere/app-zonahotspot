"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SigninSection from "@/app/auth/sections/SigninSection";
import SignupSection from "@/app/auth/sections/SignupSection";

export default function AuthPage() {
  const [view, setView] = useState<'signin' | 'signup'>('signin');

  return (
    <main className="flex flex-1 w-screen h-screen justify-center bg-secondary-theme-foreground/30">
      <div className="flex flex-1 flex-col gap-2 items-center justify-center bg-background border-l-2 border-ring/30">
        <div className="flex flex-[1] w-full items-center justify-center">
          <h6 className="text-2xl text-primary-theme font-extrabold">
            ZONA HOTSPOT
          </h6>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={view} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-[6] w-full items-start px-8 py-2"
          >
            {view === 'signin' ? (
              <SigninSection onSwitchView={() => setView('signup')} />
            ) : (
              <SignupSection onSwitchView={() => setView('signin')} />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-[2] w-full items-start justify-center">
          <h6 className="text-[10px] text-secondary-theme-foreground font-semibold tracking-widest">
            © 2025 Zonahotspot All rights reserved
          </h6>
        </div>
      </div>
    </main>
  );
}