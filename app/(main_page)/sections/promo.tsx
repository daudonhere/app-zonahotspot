"use client";

import { subscribeUserToPush } from "@/libs/push-client";
import { subscribePush } from "@/actions/push";

export default function PromoCardSection() {
  const handleUsePromo = async () => {
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
        <span className="text-red-600 text-xs">Selengkapnya</span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-red-600 p-4 text-white shadow-xl border-2 border-gray-300/50">
        <p className="text-lg font-extrabold">Disc 50% + 20%</p>
        <p className="text-xs opacity-90">Travel to Any Beach</p>

        <button
          onClick={handleUsePromo}
          className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-1 text-xs font-bold text-red-600 shadow"
        >
          Gunakan
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-red-600 p-4 text-white shadow-xl border-2 border-gray-300/50">
        <p className="text-lg font-extrabold">Disc 50% + 20%</p>
        <p className="text-xs opacity-90">Travel to Any Beach</p>

        <button
          onClick={handleUsePromo}
          className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-1 text-xs font-bold text-red-600 shadow"
        >
          Gunakan
        </button>
      </div>
    </div>
  );
}
