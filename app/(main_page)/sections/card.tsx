"use client";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  Activity,
} from "lucide-react";
export default function CardSection() {
  return (
    <div className="w-full rounded-2xl bg-background border border-ring/50 p-4 shadow-xl">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Paket Internet</p>
          <p className="text-lg font-extrabold">Rp 300.000</p>
          <p className="text-xs text-muted-foreground">30 Mbps</p>
        </div>
        <div className="flex items-center">
          <button className="rounded-lg bg-primary-theme px-3 py-2 text-xs font-bold text-primary-theme-foreground shadow">
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
          icon={<ArrowDownCircle size={22} />}
          label="Downgrade"
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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-theme/20 text-primary-theme shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
    </button>
  );
}
