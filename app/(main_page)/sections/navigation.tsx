"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, ReceiptText, User } from "lucide-react";
import { useLoaderStore } from "@/stores/loaderStore";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoaderStore();

  const navigate = (href: string) => {
    if (pathname === href) return;
    startLoading();
    router.push(href);
  };

  const isActive = (menu: "home" | "package" | "invoice" | "account") => {
    if (menu === "home" && pathname === "/") return true;
    if (menu === "package" && pathname.startsWith("/package")) return true;
    if (menu === "invoice" && pathname.startsWith("/invoice")) return true;
    if (menu === "account" && pathname.startsWith("/account")) return true;
    if (
      menu === "invoice" &&
      ["/payment", "/history"].some((p) => pathname.startsWith(p))
    )
      return true;
    if (menu === "package" && pathname.startsWith("/voucher")) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 rounded-t-3xl border-t border-ring/50 bg-background shadow-2xl">
      <div className="flex justify-around py-3 text-xs text-ring">
        <NavItem
          label="Beranda"
          icon={<Home size={25} />}
          active={isActive("home")}
          onClick={() => navigate("/")}
        />
        <NavItem
          label="Paket"
          icon={<ShoppingBag size={25} />}
          active={isActive("package")}
          onClick={() => navigate("/package")}
        />
        <NavItem
          label="Tagihan"
          icon={<ReceiptText size={25} />}
          active={isActive("invoice")}
          onClick={() => navigate("/invoice")}
        />
        <NavItem
          label="Akun"
          icon={<User size={25} />}
          active={isActive("account")}
          onClick={() => navigate("/account")}
        />
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? "text-primary-theme" : "text-ring"
      }`}
    >
      {icon}
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  );
}
