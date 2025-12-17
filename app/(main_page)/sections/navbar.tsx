"use client";

import { Home, ShoppingBag, History, User } from "lucide-react";

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 rounded-t-3xl w-full min-w-full -translate-x-1/2 border-t bg-white shadow-2xl">
      <div className="flex justify-around py-3 text-xs text-gray-400">
        <NavItem label="Beranda" active icon={<Home size={25} />} />
        <NavItem label="Paket" icon={<ShoppingBag size={25} />} />
        <NavItem label="Transaksi" icon={<History size={25} />} />
        <NavItem label="Akun" icon={<User size={25} />} />
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        active ? "text-red-600" : ""
      }`}
    >
      {icon}
      <span className="text-[12px] font-semibold">{label}</span>
    </div>
  );
}
