"use client";
import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoaderStore } from "@/stores/loaderStore";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/libs/api/endpoints";
import { getFullApiUrl } from "@/libs/api/utils";
import { authStore } from "@/stores/authStore";
import RecoveryPhraseModal from "@/components/ui/recovery-phrase-modal";
interface SigninSectionProps {
  onSwitchView: () => void;
}
type AuthView = "login" | "recovery" | "otp";
export default function SigninSection({ onSwitchView }: SigninSectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [countdown, setCountdown] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const router = useRouter();
  const { startLoading, stopLoading } = useLoaderStore();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'social_login_success') {
        if (event.data.data.result && event.data.data.result.phrase) {
          setRecoveryPhrase(event.data.data.result.phrase);
          setShowRecoveryModal(true);
          toast.success(event.data.data.description || "Registration successful");
        } else {
          const userData = event.data.data.result?.user || event.data.data.result?.data?.user || event.data.data.user;
          if (event.data.data.result?.data?.accessToken) {
            authStore.login(event.data.data.result.data.accessToken, userData);
          } else if (event.data.data.accessToken) {
            authStore.login(event.data.data.accessToken, userData);
          }
          toast.success("Login successful!");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      } else if (event.data.type === 'social_login_error') {
        toast.error(`Login failed: ${event.data.error}`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);
  const handleSocialLogin = (provider: "google" | "github") => {
    const popup = window.open(
      `${getFullApiUrl(provider === "google" ? AUTH_ENDPOINTS.GOOGLE : AUTH_ENDPOINTS.GITHUB)}`,
      "social_login",
      "width=500,height=700"
    );
    if (popup) {
      popup.focus();
    }
  };
  const handleLogin = async () => {
    const newErrors: { email?: boolean; password?: boolean } = {};
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all fields");
      return;
    }
    try {
      startLoading();
      const response = await fetch(getFullApiUrl(AUTH_ENDPOINTS.LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setErrors({ email: true, password: true });
        throw new Error(data.description || data.message || "Login failed");
      }
      const data = await response.json();
      const accessToken = data.result?.accessToken || data.result?.data?.accessToken || data.accessToken;
      const userData = data.result?.user || data.result?.data?.user || data.user;
      if (accessToken) {
        authStore.login(accessToken, userData);
        toast.success(data.description || "Login successful");
        setTimeout(() => {
          router.refresh();
          router.push("/");
        }, 1500);
      } else {
         toast.success(data.description || "Login successful");
         setTimeout(() => {
           router.refresh();
           router.push("/");
         }, 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      stopLoading();
    }
  };
  const handleNavigate = (targetView: AuthView) => {
    if (targetView === "otp") {
      setCountdown(15);
      setIsTimerActive(true);
    }
    if (targetView === "login") {
      setIsTimerActive(false);
    }
    setView(targetView);
  };
  const handleResendOtp = () => {
    setCountdown(15);
    setIsTimerActive(true);
    console.log("Re-Sending OTP...");
  };

  const handleRecoverAccount = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!passphrase) {
      toast.error("Please enter your passphrase");
      return;
    }

    try {
      startLoading();
      const response = await fetch(getFullApiUrl(USER_ENDPOINTS.RECOVER_ACCOUNT), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          passphrase
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.description || data.message || "Recovery failed");
      }

      const data = await response.json();
      toast.success(data.description || "Account recovery successful");

      // Reset form fields
      setEmail("");
      setPassphrase("");

      // Navigate back to login after a short delay
      setTimeout(() => {
        handleNavigate("login");
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during account recovery");
      }
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    if (!isTimerActive) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);
  return (
    <div className="flex flex-1 flex-col gap-2 h-full p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-6 w-full"
        >
          {view === "login" && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-7 flex-col gap-3 items-center justify-center">
                <div className="flex w-full items-center">
                  <Input
                    type="email"
                    placeholder="Email"
                    className={`text-sm text-primary w-full ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: false }));
                    }}
                  />
                </div>
                <div className="relative flex w-full items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`text-sm text-primary w-full ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: false }));
                    }}
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
              </div>
              <div className="flex flex-3 flex-row gap-2">
                <div className="flex flex-6 w-full justify-start">
                  <Button
                    variant="link"
                    onClick={() => handleNavigate("recovery")}
                    className="-ml-3 text-sm font-base tracking-wider"
                  >
                    Forgot Password ?
                  </Button>
                </div>
                <div className="flex flex-4 w-full justify-end">
                  <Button
                    onClick={handleLogin}
                    variant="primary"
                    className="flex flex-row w-full items-center"
                  >
                    <h4 className="text-sm font-extrabold tracking-widest">
                      Login
                    </h4>
                  </Button>
                </div>
              </div>
            </div>
          )}
          {view === "recovery" && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-7 flex-col gap-3 items-center justify-center">
                <div className="flex w-full items-center">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="text-sm text-primary w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex w-full items-center">
                  <Input
                    type="text"
                    placeholder="Passphrase"
                    className="text-sm text-primary w-full"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-3 flex-row gap-2">
                <div className="flex flex-6 w-full justify-start">
                  <Button
                    variant="link"
                    onClick={() => handleNavigate("login")}
                    className="-ml-3 text-sm font-base tracking-wider"
                  >
                    Back To Login
                  </Button>
                </div>
                <div className="flex flex-4 w-full justify-end">
                  <Button
                    variant="primary"
                    onClick={handleRecoverAccount}
                    className="flex flex-row w-full items-center"
                  >
                    <h4 className="text-sm font-base tracking-widest">
                      Recovery
                    </h4>
                  </Button>
                </div>
              </div>
            </div>
          )}
          {view === "otp" && (
            <div className="flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-1 flex-col gap-2 justify-center">
                <div className="flex flex-3 w-full items-center justify-center">
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
                <div className="flex flex-2 w-full items-center justify-center">
                  {isTimerActive ? (
                    <p className="text-sm font-base tracking-wider opacity-40">
                      Re-send OTP in {countdown} second..
                    </p>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleResendOtp}
                      className="flex flex-row w-1/2 items-center"
                    >
                      <h4 className="text-sm font-base tracking-widest">
                        Resend OTP
                      </h4>
                    </Button>
                  )}
                </div>
                <div className="flex flex-5 w-full items-center justify-center">
                  <Button
                    variant="link"
                    onClick={() => handleNavigate("login")}
                    className="flex flex-row w-1/2 items-center"
                  >
                    <h4 className="text-sm font-base tracking-widest">
                      Back To Login
                    </h4>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-4 flex-col gap-2">
        <div className="flex flex-1 flex-row gap-2 justify-center">
          <div className="flex flex-1 mt-3 border-t border-ring/50" />
          <h4 className="text-sm text-secondary-theme-foreground font-base tracking-wide">
            Login With
          </h4>
          <div className="flex flex-1 mt-3 border-t border-ring/50" />
        </div>
        <div className="flex flex-9 flex-col gap-2 items-center">
          <div className="flex flex-4 flex-row w-full gap-2 items-center justify-center">
            <div className="flex flex-row gap-2 items-center">
              <Button
                variant="ghost"
                onClick={() => handleSocialLogin("google")}
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
                onClick={() => handleSocialLogin("github")}
                className="flex flex-row p-4 items-center rounded-full"
              >
                <Image
                  src="/icons/github.svg"
                  width={25}
                  height={25}
                  alt="github"
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
              className="text-sm font-base tracking-wider"
            >
              Dont Have Account ? Register
            </Button>
          </div>
        </div>
      </div>
      <RecoveryPhraseModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        phrase={recoveryPhrase}
      />
    </div>
  );
}
