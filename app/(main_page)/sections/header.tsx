"use client";
import { useEffect, useRef, useState } from "react";
import { BellRing, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLoaderStore } from "@/stores/loaderStore";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/stores/authStore"; 
const PAGE_TITLES: Record<string, string> = {
  "/package": "Paket",
  "/invoice": "Tagihan",
  "/account": "Akun",
  "/payment": "Pembayaran",
  "/history": "Riwayat",
};
const NOTIFICATIONS = [
  {
    id: 1,
    title: "Tagihan baru tersedia",
    time: "2 menit lalu",
    read: false,
  },
  {
    id: 2,
    title: "Pembayaran berhasil",
    time: "1 jam lalu",
    read: true,
  },
  {
    id: 3,
    title: "Promo paket 100 Mbps",
    time: "Kemarin",
    read: true,
  },
  {
    id: 4,
    title: "Voucher diskon aktif",
    time: "2 hari lalu",
    read: false,
  },
  {
    id: 5,
    title: "Perubahan status akun",
    time: "3 hari lalu",
    read: true,
  },
];
export default function HeaderSection() {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useLoaderStore();
  const { user } = useAuth(); 
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState("Selamat Pagi"); 
  const isHome = pathname === "/";
  const pageTitle = PAGE_TITLES[pathname];
  const hasUnread = NOTIFICATIONS.some((n) => !n.read);
  useEffect(() => {
    const hours = new Date().getHours();
    let newGreeting = "Selamat Pagi";
    if (hours >= 4 && hours < 10) {
      newGreeting = "Selamat Pagi";
    } else if (hours >= 10 && hours < 15) {
      newGreeting = "Selamat Siang";
    } else if (hours >= 15 && hours < 18) {
      newGreeting = "Selamat Sore";
    } else {
      newGreeting = "Selamat Malam";
    }
    setGreeting(newGreeting);
  }, []);
  const handleBack = () => {
    startLoading();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  const handleToNotificationPage = () => {
    setOpenNotif(false);
    startLoading();
    router.push("/notification");
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="relative flex w-full flex-col gap-4 rounded-b-3xl bg-primary-theme px-4 py-5 text-primary-theme-foreground shadow-xl">
      <div className="flex items-center justify-between">
        {/* ===== LEFT SIDE ===== */}
        {isHome ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold opacity-80">
              Hi, {greeting}!
            </span>
            <span className="text-lg font-bold">
              {user?.fullname || user?.email?.split('@')[0] || "Guest"}
            </span>
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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="relative rounded-full bg-primary-theme-foreground/20 p-3 shadow-xl"
          >
            <BellRing size={20} />
            {hasUnread && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-primary-theme" />
            )}
          </button>
          <AnimatePresence>
            {openNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl bg-background text-foreground shadow-2xl"
              >
                <div className="flex flex-col divide-y divide-ring/30">
                  {NOTIFICATIONS.length > 0 ? (
                    NOTIFICATIONS.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 text-sm transition-colors ${
                          notif.read
                            ? "bg-background hover:bg-muted"
                            : "bg-primary-theme/10 hover:bg-primary-theme/20"
                        }`}
                      >
                        <p
                          className={`font-semibold ${
                            notif.read ? "" : "text-primary-theme"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-xs opacity-60">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm opacity-60">
                      Belum ada notifikasi
                    </div>
                  )}
                  <button
                    onClick={handleToNotificationPage}
                    className="px-4 py-3 text-center text-sm font-semibold text-primary-theme hover:bg-muted"
                  >
                    Selengkapnya
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}