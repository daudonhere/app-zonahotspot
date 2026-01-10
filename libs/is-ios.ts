export const isIOS = () =>
  typeof window !== "undefined" &&
  /iphone|ipad|ipod/i.test(window.navigator.userAgent);
export const isInStandaloneMode = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(display-mode: standalone)").matches;
