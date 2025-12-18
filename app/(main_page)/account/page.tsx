"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex w-full flex-col gap-4 p-3">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-primary-theme p-4 text-background shadow-xl border-2 border-ring/50">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow">
          <Image
            src="/icons/avatar.png"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>

        <div className="text-center">
          <p className="text-lg font-extrabold">Saepul</p>
          <p className="text-xs opacity-80">saepul@email.com</p>
        </div>

        <button className="mt-2 rounded-lg bg-background px-4 py-1 text-xs font-bold text-primary-theme shadow">
          Ubah Foto
        </button>
      </div>
      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">Informasi Akun</p>

        <div className="mt-3 flex flex-col gap-3 text-sm">
          <InfoRow label="Nama Lengkap" value="Saepul" />
          <InfoRow label="Email" value="saepul@email.com" />
          <InfoRow label="Nomor Telepon" value="+628956050900" />
        </div>
      </div>
      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">Keamanan</p>

        <div className="mt-3 flex flex-col gap-3">
          <ActionRow label="Ubah Kata Sandi" />
        </div>
      </div>
      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <p className="text-sm font-bold text-foreground">Alamat</p>

        <p className="mt-2 text-sm text-foreground">
          Jl. Mawar No. 12, Kecamatan Sukamaju, Kota Bandung, Jawa Barat 40123
        </p>

        <button className="mt-3 rounded-lg bg-primary-theme px-4 py-2 text-xs font-bold text-background shadow">
          Ubah Alamat
        </button>
      </div>
      <div className="rounded-xl bg-background p-4 shadow-xl border-2 border-ring/50">
        <div className="mt-3 flex flex-col gap-3">
          <button className="w-full rounded-lg bg-primary-theme py-2 text-sm font-bold text-primary-theme-foreground shadow">
            Hubungkan Pembayaran
          </button>
          <button className="w-full rounded-lg border-2 bg-primary-theme py-2 text-sm font-bold text-primary-theme-foreground shadow">
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-foreground text-right">
        {value}
      </span>
    </div>
  );
}

function ActionRow({ label }: { label: string }) {
  return (
    <button className="flex w-full justify-between rounded-lg border border-ring/50 px-3 py-2 text-sm font-semibold text-foreground shadow-sm">
      {label}
      <span className="text-primary-theme">
        <ChevronRight/>
      </span>
    </button>
  );
}
