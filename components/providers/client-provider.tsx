"use client";
import LoaderProvider from "@/components/providers/loader-provider";
import LenisProvider from "@/components/providers/lenis-provider";
import LockProvider from "@/components/providers/lock-provider";
import { Toaster } from "@/components/ui/sonner";
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoaderProvider>
      <LenisProvider>
        <LockProvider>
          {children}
        </LockProvider>
        <Toaster position="top-right" richColors />
      </LenisProvider>
    </LoaderProvider>
  );
}