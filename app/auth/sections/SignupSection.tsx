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
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/libs/api/endpoints";
import { getFullApiUrl } from "@/libs/api/utils";
import { useLoaderStore } from "@/stores/loaderStore";
import { authStore } from "@/stores/authStore";
import RecoveryPhraseModal from "@/components/ui/recovery-phrase-modal";
import SuccessModal from "@/components/ui/success-modal";
interface SignupSectionProps {
  onSwitchView: () => void;
}
export default function SignupSection({ onSwitchView }: SignupSectionProps) {
  const [isVerif, setIsVerif] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean; fullname?: boolean; password?: boolean; confirmPassword?: boolean }>({});
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
          setIsVerif(true);
        } else {
          if (event.data.data.result?.data?.accessToken) {
            authStore.login(event.data.data.result.data.accessToken);
          } else if (event.data.data.accessToken) {
            authStore.login(event.data.data.accessToken);
          }
          toast.success("Login successful!");
        }
      } else if (event.data.type === 'social_login_error') {
        toast.error(`Login failed: ${event.data.error}`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
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
  const startTimer = () => {
    setCountdown(15);
    setIsTimerActive(true);
  };
  const toggleVerifVisibility = async () => {
    const newErrors: { email?: boolean; fullname?: boolean; password?: boolean; confirmPassword?: boolean } = {};
    if (!email) newErrors.email = true;
    if (!fullname) newErrors.fullname = true;
    if (!password) newErrors.password = true;
    if (!confirmPassword) newErrors.confirmPassword = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ password: true, confirmPassword: true });
      toast.error("Passwords do not match");
      return;
    }
    try {
      startLoading();
      const response = await fetch(getFullApiUrl(USER_ENDPOINTS.CREATE_USER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, fullname, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setErrors({ email: true });
        throw new Error(data.description || data.message || "Registration failed");
      }
      const data = await response.json();
      if (data.result && data.result.phrase) {
        setRecoveryPhrase(data.result.phrase);
        setShowRecoveryModal(true);
      } else {
        setShowSuccessModal(true);
      }
      toast.success(data.description || "Registration successful, please verify your email");
      setVerificationEmail(email);
      setIsVerif(true);
      startTimer();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during registration");
      }
    } finally {
      stopLoading();
    }
  };
  const handleResendOtp = async () => {
    try {
      startLoading();
      const response = await fetch(getFullApiUrl(USER_ENDPOINTS.RESEND_OTP), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: verificationEmail }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.description || data.message || "Failed to resend OTP");
      }
      const data = await response.json();
      toast.success(data.description || "OTP has been resent to your email");
      startTimer();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while resending OTP");
      }
    } finally {
      stopLoading();
    }
  };
  const handleVerifyOtp = async (otpValue: string) => {
    try {
      startLoading();
      const response = await fetch(getFullApiUrl(USER_ENDPOINTS.VERIFY_OTP), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: verificationEmail,
          code: otpValue
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.description || data.message || "OTP verification failed");
      }
      const data = await response.json();
      if (data.result && data.result.data) {
        const { accessToken, refreshToken, user } = data.result.data;
        authStore.login(accessToken);
        toast.success(data.description || "Email verified successfully");
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during OTP verification");
      }
    } finally {
      stopLoading();
    }
  };
  const handleSkipVerification = () => {
    setIsVerif(false);
    setVerificationEmail("");
    onSwitchView();
  };
  useEffect(() => {
    if (!isTimerActive) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);
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
                  <InputOTP
                    maxLength={6}
                    onComplete={(value) => {
                      handleVerifyOtp(value);
                    }}
                  >
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
                  <div className="flex flex-2 w-full justify-center">
                    {isTimerActive ? (
                      <p className="text-sm font-base tracking-wider opacity-40">
                        Re-send OTP in {countdown} second..
                      </p>
                    ) : (
                    <div className="flex flex-2 flex-col w-full items-center p-2">
                      <Button
                        variant="link"
                        onClick={handleResendOtp}
                        className="flex flex-row w-1/2 items-center"
                      >
                        <h4 className="text-sm font-base tracking-widest">
                          Resend OTP
                        </h4>
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSkipVerification}
                        className="flex flex-row w-1/2 items-center"
                      >
                        <h4 className="text-sm font-base tracking-widest">
                          Nanti Saja
                        </h4>
                      </Button>
                    </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-7 flex-col gap-3 items-center justify-center">
                  <div className="flex w-full items-center">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className={`text-sm text-primary w-full ${errors.fullname ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      value={fullname}
                      onChange={(e) => {
                        setFullname(e.target.value);
                        if (errors.fullname) setErrors(prev => ({ ...prev, fullname: false }));
                      }}
                    />
                  </div>
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
                  <div className="relative flex w-full items-center">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-Type Password"
                      className={`text-sm text-primary w-full ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: false }));
                      }}
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
              className="justify-center text-sm font-base tracking-wider"
            >
              Already Have Account ? Login
            </Button>
          </div>
        </div>
      </div>
      <RecoveryPhraseModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        phrase={recoveryPhrase}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Registration Successful!"
        message="Your account has been created successfully. Please check your email to verify your account."
        onConfirm={() => {
          setShowSuccessModal(false);
        }}
      />
    </div>
  );
}
