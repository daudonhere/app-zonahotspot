"use client";
import { subscribeUserToPush } from "@/libs/push-client";
import { subscribePush } from "@/actions/push";
export default function VoucherCardSection() {
  const handleUseVoucher = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const subscription = await subscribeUserToPush();
    if (!subscription) return;
    await subscribePush(subscription);
    console.log("Push notification enabled via promo");
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm font-bold">
        <span>Voucher</span>
        <span className="text-primary-theme text-xs">Selengkapnya</span>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <p className="text-lg font-extrabold">10 Mbps</p>
        <p className="text-xs opacity-90">2 Jam Unlimited</p>
        <button
          onClick={handleUseVoucher}
          className="absolute bottom-4 right-4 rounded-lg bg-background px-4 py-1 text-xs font-bold text-primary-theme shadow"
        >
          Pesan
        </button>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <p className="text-lg font-extrabold">5 Mbps</p>
        <p className="text-xs opacity-90">6 Jam Unlimited</p>
        <button
          onClick={handleUseVoucher}
          className="absolute bottom-4 right-4 rounded-lg bg-background px-4 py-1 text-xs font-bold text-primary-theme shadow"
        >
          Pesan
        </button>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <p className="text-lg font-extrabold">10 Mbps</p>
        <p className="text-xs opacity-90">24 Jam Unlimited</p>
        <button
          onClick={handleUseVoucher}
          className="absolute bottom-4 right-4 rounded-lg bg-background px-4 py-1 text-xs font-bold text-primary-theme shadow"
        >
          Pesan
        </button>
      </div>
    </div>
  );
}
