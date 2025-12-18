"use client";

import { useRouter } from "next/navigation";
import { useLoaderStore } from "@/stores/loaderStore";

export default function InvoicePage() {
  const router = useRouter();
  const { startLoading } = useLoaderStore();

  const handlePayNow = () => {
    startLoading();
    router.push("/payment");
  };

  return (
    <div className="flex w-full flex-col gap-4 p-3">
      <div className="rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <p className="text-xs opacity-80">Invoice</p>
        <p className="text-lg font-extrabold">INV-2025-000123</p>

        <div className="mt-3 flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="opacity-80">Tanggal</span>
            <span className="font-semibold">17 Des 2025</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="opacity-80">Status</span>
            <span className="font-semibold">Menunggu Pembayaran</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">
          Informasi Pelanggan
        </p>
        <div className="mt-2 flex flex-col gap-1 text-sm text-foreground">
          <span>
            Nama: <b>Saepul</b>
          </span>
          <span>
            ID Pelanggan: <b>ZH-0098123</b>
          </span>
          <span>
            Email: <b>john.doe@email.com</b>
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">Detail Paket</p>

        <div className="mt-3 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span>Paket Internet</span>
            <span className="font-semibold">100 Mbps</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Durasi</span>
            <span className="font-semibold">1 Bulan</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Harga</span>
            <span className="font-semibold">Rp 100.000</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">
          Ringkasan Pembayaran
        </p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp 100.000</span>
          </div>

          <div className="flex justify-between">
            <span>Pajak</span>
            <span>Rp 0</span>
          </div>

          <div className="my-1 border-t border-ring/50" />

          <div className="flex justify-between text-base font-extrabold">
            <span>Total</span>
            <span>Rp 100.000</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-background p-4 text-background-foreground shadow-xl border-2 border-ring/50">
        <button
          onClick={handlePayNow}
          className="w-full rounded-lg bg-primary-theme py-3 text-sm font-extrabold text-primary-theme-foreground shadow"
        >
          Bayar Sekarang
        </button>

        <p className="mt-2 text-center text-xs opacity-80">
          Invoice ini akan kedaluwarsa dalam 24 jam
        </p>
      </div>
    </div>
  );
}
