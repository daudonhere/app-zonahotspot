"use client";

import { BellRing } from "lucide-react";

export default function HeaderSection() {
  return (
    <header className="flex w-full flex-col gap-4 rounded-b-3xl bg-red-600 px-4 py-5 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold opacity-80">Hi, Selamat Pagi!</span>
          <span className="text-lg font-bold">John Doe</span>
        </div>
        <button className="rounded-full items-center justify-center bg-white/20 p-3 shadow-xl">
          <BellRing size={20} />
        </button>
      </div>
    </header>
  );
}
