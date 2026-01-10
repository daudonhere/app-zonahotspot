"use client";
import { useRouter } from "next/navigation";
import { useLoaderStore } from "@/stores/loaderStore";
export default function HistorySection() {
  const router = useRouter();
  const { startLoading } = useLoaderStore();
  const handleSeeHistory = () => {
    startLoading();
    router.push("/history");
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm font-bold">
        <span>Riwayat</span>
        <button onClick={handleSeeHistory} className="text-primary-theme text-xs">
          Selengkapnya
        </button>
      </div>
      <div
        className="
          flex w-full gap-4 overflow-x-auto no-scrollbar
          snap-x snap-proximity
          overscroll-x-contain
          pb-6
          touch-pan-x
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="
              w-[42%] max-w-200px shrink-0
              snap-start
              rounded-xl bg-background p-3
              shadow-xl border border-ring/50
            "
          >
            <p className="text-xs text-muted-foreground">Paket Internet</p>
            <p className="text-sm font-bold">30 Hari</p>
            <p className="text-xs text-muted-foreground">123 Mbps</p>
            <p className="mt-2 text-xs text-primary-theme font-semibold">
              Beli Lagi
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
