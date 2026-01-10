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
  LIST_ALL: "/user/show/all",
  FIND_BY_EMAIL: (email: string) => `/user/email/${email}`,
  FIND_BY_ID: (id: string | number) => `/user/show/${id}`,
  UPDATE_ROLES: (id: string | number) => `/user/roles/${id}`,
  LIST_DELETED: "/user/deleted/all",
  RESTORE: (id: string | number) => `/user/restore/${id}`,
  UPDATE_PROFILE: (id: string | number) => `/user/edit/${id}`,
  UPDATE_CREDENTIAL: "/user/credential",
  REMOVE: (id: string | number) => `/user/remove/${id}`,
  BULK_DELETE: "/user/delete",
  RECOVER_ACCOUNT: "/user/recover",
} as const;

export const ROLE_ENDPOINTS = {
  LIST_ALL: "/role/show/all",
  FIND_BY_ID: (id: string | number) => `/role/show/${id}`,
  CREATE: "/role/create",
  EDIT: (id: string | number) => `/role/edit/${id}`,
  REMOVE: (id: string | number) => `/role/remove/${id}`,
  BULK_REMOVE: "/role/remove",
} as const;

export const ENGINE_ENDPOINTS = {
  LIST_ALL: "/engine/show/all",
  TOGGLE: (name: string) => `/engine/toggle/${name}`,
} as const;

export const ACTIVITY_ENDPOINTS = {
  LIST_ALL: "/activity/show/all",
  FIND_BY_ID: (id: string | number) => `/activity/show/${id}`,
} as const;

export const PACKAGE_ENDPOINTS = {
  LIST: "/package/show",
  CREATE: "/package/create",
  FIND: (id: string | number) => `/package/find/${id}`,
  EDIT: (id: string | number) => `/package/edit/${id}`,
  REMOVE: (id: string | number) => `/package/remove/${id}`,
} as const;

export const INVOICE_ENDPOINTS = {
  LIST: "/invoice/show",
  FIND: (id: string | number) => `/invoice/find/${id}`,
  CREATE: "/invoice/create",
  UPDATE_STATUS: (id: string | number) => `/invoice/edit/${id}`,
  REMOVE: (id: string | number) => `/invoice/remove/${id}`,
} as const;

export const NOTIFICATION_ENDPOINTS = {
  LIST: "/v1/notification/show",
  LIST_ALL: "/v1/notification/all",
  FIND: (id: string | number) => `/v1/notification/find/${id}`,
  MARK_AS_READ: (id: string | number) => `/v1/notification/read/${id}`,
  MARK_ALL_AS_READ: "/v1/notification/read-all",
  REMOVE: (id: string | number) => `/v1/notification/delete/${id}`,
  REMOVE_ALL: "/v1/notification/delete-all",
  PUSH_SUBSCRIPTION: "/v1/notification/push-subscription",
  REMOVE_PUSH_SUBSCRIPTION: "/v1/notification/push-subscription",
  CREATE: "/v1/notification/create",
  BROADCAST: "/v1/notification/broadcast",
} as const;

export const SUBSCRIPTION_ENDPOINTS = {
  LIST: "/subscription/show",
  CREATE: "/subscription/create",
  FIND: (id: string | number) => `/subscription/find/${id}`,
  EDIT: (id: string | number) => `/subscription/edit/${id}`,
  REMOVE: (id: string | number) => `/subscription/remove/${id}`,
} as const;
