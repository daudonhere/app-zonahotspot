"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLoaderStore } from "@/stores/loaderStore";
import { useAssetPreloader } from "@/hooks/useAssetPreloader";
import { initialAssets } from "@/libs/preload-assets";
import { ThreeDot } from "react-loading-indicators";
import { AnimatePresence, motion } from "motion/react";
export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading, startLoading, stopLoading } = useLoaderStore();
  const { isPreloaded } = useAssetPreloader(initialAssets);
  const isInitialLoad = useRef(true);
  useEffect(() => {
    if (!isPreloaded) return;
    const timer = setTimeout(() => {
      stopLoading();
      isInitialLoad.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [isPreloaded, stopLoading]);
  useEffect(() => {
    if (isInitialLoad.current) return;
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 700);
    return () => clearTimeout(timer);
  }, [pathname, startLoading, stopLoading]);
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-background/60 backdrop-blur-lg"
          >
            <ThreeDot variant="bounce" color="#f70a0a" size="medium" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="min-h-screen w-full"
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
