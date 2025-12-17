"use client";

import { useState } from "react";
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

interface SignupSectionProps {
  onSwitchView: () => void;
}

export default function SignupSection({ onSwitchView }: SignupSectionProps) {
  const [isVerif, setIsVerif] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleVerifVisibility = () => {
    setIsVerif(!isVerif);
  };

  return (
    <div className="flex flex-1 flex-col gap-2 h-full p-2">
      <div className="flex flex-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={isVerif ? "verif" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-1 flex-col gap-2 w-full"
          >
            {isVerif ? (
              <>
                <div className="flex flex-1 flex-col gap-6 items-center justify-center">
                  <h4 className="text-xs text-secondary-theme-foreground font-base tracking-wide text-center">
                    We have sent a Code to your email, check it.
                  </h4>

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
              </>
            ) : (
              <>
                <div className="flex flex-7 flex-col gap-3 items-center justify-center">
                  <div className="flex w-full items-center">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="text-sm text-primary w-full"
                    />
                  </div>

                  <div className="relative flex w-full items-center">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="text-sm text-primary w-full"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-primary-theme" />
                      ) : (
                        <Eye className="h-5 w-5 text-primary-theme" />
                      )}
                    </div>
                  </div>

                  <div className="relative flex w-full items-center">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-Type Password"
                      className="text-sm text-primary w-full"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-primary-theme" />
                      ) : (
                        <Eye className="h-5 w-5 text-primary-theme" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-3 flex-row gap-2">
                  <div className="flex flex-1 w-full justify-end">
                    <Button
                      onClick={toggleVerifVisibility}
                      variant="primary"
                      className="flex flex-row w-1/3 items-center"
                    >
                      <h4 className="text-sm font-extrabold tracking-widest">
                        Register
                      </h4>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-4 flex-col gap-2">
        <div className="flex flex-1 flex-row gap-2 justify-center">
          <div className="flex flex-1 mt-3 border-t border-ring/50" />
          <h4 className="text-sm text-secondary-theme-foreground font-base tracking-wide">
            Register With
          </h4>
          <div className="flex flex-1 mt-3 border-t border-ring/50" />
        </div>

        <div className="flex flex-9 flex-col gap-2 items-center">
          <div className="flex flex-4 flex-row w-full gap-2 items-center justify-center">
            <div className="flex flex-row gap-2 items-center">
              <Button
                variant="ghost"
                className="flex flex-row p-4 items-center rounded-full"
              >
                <Image
                  src="/icons/google.svg"
                  width={20}
                  height={20}
                  alt="google"
                  quality={90}
                  priority
                />
              </Button>
              <Button
                variant="ghost"
                className="flex flex-row p-4 items-center rounded-full"
              >
                <Image
                  src="/icons/github.svg"
                  width={25}
                  height={25}
                  alt="google"
                  quality={90}
                  priority
                />
              </Button>
            </div>
          </div>

          <div className="flex flex-6 w-full flex-row gap-2 items-end justify-center">
            <Button
              variant="link"
              onClick={onSwitchView}
              className="justify-center text-sm font-base tracking-wider"
            >
              Already Have Account ? Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}