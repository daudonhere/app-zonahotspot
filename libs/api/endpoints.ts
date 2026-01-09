export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  GOOGLE: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",
  GITHUB: "/auth/github",
  GITHUB_CALLBACK: "/auth/github/callback",
} as const;

export const USER_ENDPOINTS = {
  CREATE_USER: "/user/create",
  VERIFY_OTP: "/user/verif/confirm",
  RESEND_OTP: "/user/verif/send",
} as const;
