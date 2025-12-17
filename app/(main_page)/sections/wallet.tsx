"use client";

import {
  ArrowUpCircle,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react";

export default function WalletSection() {
  return (
    <div className="w-full rounded-2xl bg-white border border-gray-300/50 p-4 shadow-xl">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-gray-500">Paket Internet</p>
          <p className="text-lg font-extrabold">Rp 123.687</p>
          <p className="text-xs italic text-gray-500">123 Mbps</p>
        </div>
        <div className="flex items-center">
          <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white shadow">
            Perbarui
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <ActionItem
          icon={<ArrowUpCircle size={22} />}
          label="Upgrade"
        />
        <ActionItem
          icon={<FileText size={22} />}
          label="Tagihan"
        />
        <ActionItem
          icon={<BarChart3 size={22} />}
          label="Laporan"
        />
        <ActionItem
          icon={<Activity size={22} />}
          label="Status"
        />
      </div>
    </div>
  );
}

function ActionItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex flex-col items-center gap-2 focus:outline-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-700">
        {label}
      </span>
    </button>
  );
}
