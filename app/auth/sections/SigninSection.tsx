"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";


interface SigninSectionProps {
  onSwitchView: () => void;
}
type AuthView = 'login' | 'recovery' | 'otp';

export default function SigninSection({ onSwitchView }: SigninSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const [countdown, setCountdown] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const handleNavigate = (targetView: AuthView) => {
    if (targetView === 'otp') {
      setCountdown(15);
      setIsTimerActive(true);
    }
    if (targetView === 'login') {
      setIsTimerActive(false);
    }
    setView(targetView);
  };

  const handleResendOtp = () => {
    setCountdown(15);
    setIsTimerActive(true);
    console.log("Re-Sending OTP...");
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerActive, countdown]);
  
  if (!mounted) {
    return <div className="flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2 h-full p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-[6] w-full"
        >
          {view === 'login' && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-[7] flex-col gap-3 items-center justify-center">
                <div className="flex w-full items-center">
                  <Input type="email" placeholder="Email" className="text-sm text-primary w-full" />
                </div>
                <div className="relative flex w-full items-center">
                  <Input type={showPassword ? "text" : "password"} placeholder="Password" className="text-sm text-primary w-full" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-primary-theme" /> : <Eye className="h-5 w-5 text-primary-theme" />}
                  </div>
                </div>
              </div>
              <div className="flex flex-[3] flex-row gap-2">
                <div className="flex flex-[6] w-full justify-start">
                  <Button 
                    variant="link" 
                    onClick={() => handleNavigate('recovery')} 
                    className="-ml-3 text-sm font-base tracking-wider"
                  >
                    Forgot Password ?
                  </Button>
                </div>
                <div className="flex flex-[4] w-full justify-end">
                  <Button variant="primary" className="flex flex-row w-full items-center">
                    <h4 className="text-sm font-extrabold tracking-widest">
                      Login
                    </h4>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {view === 'recovery' && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-[7] flex-col gap-3 items-center justify-center">
                <div className="flex w-full items-center">
                  <Input type="email" placeholder="Email" className="text-sm text-primary w-full" />
                </div>
              </div>
              <div className="flex flex-[3] flex-row gap-2">
                <div className="flex flex-[6] w-full justify-start">
                  <Button 
                    variant="link" 
                    onClick={() => handleNavigate('login')} 
                    className="-ml-3 text-sm font-base tracking-wider"
                  >
                    Back To Login
                  </Button>
                </div>
                <div className="flex flex-[4] w-full justify-end">
                  <Button variant="primary" onClick={() => handleNavigate('otp')} className="flex flex-row w-full items-center">
                    <h4 className="text-sm font-base tracking-widest">Recovery</h4>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {view === 'otp' && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-1 flex-col gap-2 justify-center">
                <div className="flex flex-[3] w-full items-center justify-center">
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex flex-[2] w-full items-center justify-center">
                  {isTimerActive ? (
                    <p className="text-sm font-base tracking-wider opacity-40">Re-send OTP in {countdown} second..</p>
                  ) : (
                    <Button variant="primary" onClick={handleResendOtp} className="flex flex-row w-1/2 items-center">
                      <h4 className="text-sm font-base tracking-widest">Resend OTP</h4>
                    </Button>
                  )}
                </div>
                <div className="flex flex-[5] w-full items-center justify-center">
                  <Button variant="link" onClick={() => handleNavigate('login')} className="flex flex-row w-1/2 items-center">
                    <h4 className="text-sm font-base tracking-widest">Back To Login</h4>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-[4] flex-col gap-2">
        <div className="flex flex-[1] flex-row gap-2 justify-center">
          <div className="flex flex-1 mt-3 border-t border-ring/50"/>
          <h4 className="text-sm text-secondary-theme-foreground font-base tracking-wide">
            Login With
          </h4>
          <div className="flex flex-1 mt-3 border-t border-ring/50"/>
        </div>
        <div className="flex flex-[9] flex-col gap-2 items-center">
          <div className="flex flex-[4] flex-row w-full gap-2 items-center justify-center">
            <div className="flex flex-row gap-2 items-center">
              <Button variant="ghost" className="flex flex-row p-4 items-center rounded-full">
                <Image src="/icons/google.svg" width={20} height={20} alt="google" quality={90} priority />
              </Button>
              <Button variant="ghost" className="flex flex-row p-4 items-center rounded-full">
                <Image src="/icons/github.svg" width={25} height={25} alt="google" quality={90} priority />
              </Button>
            </div>
          </div>
          <div className="flex flex-[6] w-full flex-row gap-2 items-end justify-center">
            <Button 
              variant="link" 
              onClick={onSwitchView} 
              className="text-sm font-base tracking-wider"
            >
              Dont Have Account ? Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}