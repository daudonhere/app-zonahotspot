"use client";

import { BellRing, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLoaderStore } from "@/stores/loaderStore";

const PAGE_TITLES: Record<string, string> = {
  "/package": "Paket",
  "/invoice": "Tagihan",
  "/account": "Akun",
  "/payment": "Pembayaran",
  "/history": "Riwayat",
};

export default function HeaderSection() {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useLoaderStore();

  const isHome = pathname === "/";
  const pageTitle = PAGE_TITLES[pathname];

  const handleBack = () => {
    startLoading();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };


  return (
    <header className="flex w-full flex-col gap-4 rounded-b-3xl bg-primary-theme px-4 py-5 text-primary-theme-foreground shadow-xl">
      <div className="flex items-center justify-between">
        {isHome ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold opacity-80">
              Hi, Selamat Sore!
            </span>
            <span className="text-lg font-bold">Saepul</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="-mt-1">
              <ChevronLeft size={25} />
            </button>
            <span className="text-lg font-bold">
              {pageTitle ?? "Halaman"}
            </span>
          </div>
        )}
        <button className="rounded-full bg-primary-theme-foreground/20 p-3 shadow-xl">
          <BellRing size={20} />
        </button>
      </div>
    </header>
  );
}
