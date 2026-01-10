import { create } from "zustand";
interface LoaderState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}
let startTime = 0;
const MIN_DURATION = 200;
export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: true,
  startLoading: () => {
    startTime = Date.now();
    set({ isLoading: true });
  },
  stopLoading: () => {
    const elapsed = Date.now() - startTime;
    const remaining = MIN_DURATION - elapsed;
    if (remaining > 0) {
      setTimeout(() => set({ isLoading: false }), remaining);
    } else {
      set({ isLoading: false });
    }
  },
}));
