"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="flex w-full flex-col gap-4 p-3">

      <div className="rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <p className="text-xs opacity-80">Invoice</p>
        <p className="text-lg font-extrabold">INV-2025-000123</p>

        <div className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span>Paket</span>
            <span className="font-semibold">100 Mbps</span>
          </div>
          <div className="flex justify-between">
            <span>Durasi</span>
            <span className="font-semibold">1 Bulan</span>
          </div>
          <div className="flex justify-between">
            <span>Total Tagihan</span>
            <span className="text-base font-extrabold">Rp 100.000</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">Metode Pembayaran</p>

        <div className="mt-4 flex flex-col gap-3">

          <PaymentItem
            title="QRIS"
            subtitle="Scan QR untuk membayar"
            icon="/icons/payment/qris.png"
          />

          <PaymentItem
            title="DANA"
            subtitle="Saldo DANA"
            icon="/icons/payment/dana.png"
          />

          <p className="mt-2 text-xs font-semibold text-gray-500">
            Virtual Account
          </p>

          <PaymentItem
            title="Mandiri"
            subtitle="Virtual Account"
            icon="/icons/payment/mandiri.png"
          />
          <PaymentItem
            title="BCA"
            subtitle="Virtual Account"
            icon="/icons/payment/bca.png"
          />
          <PaymentItem
            title="BRI"
            subtitle="Virtual Account"
            icon="/icons/payment/bri.png"
          />
          <PaymentItem
            title="BNI"
            subtitle="Virtual Account"
            icon="/icons/payment/bni.png"
          />

        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        Dengan melanjutkan pembayaran, Anda menyetujui syarat & ketentuan penggunaan dan pembayaran.
      </div>

    </div>
  );
}


function PaymentItem({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-lg border border-ring/50 bg-white px-3 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-start text-sm">
          <span className="font-semibold text-foreground">
            {title}
          </span>
          <span className="text-xs text-gray-500">
            {subtitle}
          </span>
        </div>
      </div>

      <span className="text-primary-theme text-lg font-bold">
        <ChevronRight />
      </span>
    </button>
  );
}
