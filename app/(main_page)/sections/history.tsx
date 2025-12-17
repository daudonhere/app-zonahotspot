"use client";

export default function HistorySection() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm font-bold">
        <span>Riwayat Transaksi</span>
        <span className="text-red-600 text-xs">Selengkapnya</span>
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
              rounded-xl bg-white p-3
              shadow-xl border border-gray-300/50
            "
          >
            <p className="text-xs text-gray-500">Paket Internet</p>
            <p className="text-sm font-bold">30 Day</p>
            <p className="text-xs text-gray-500">123 Mbps</p>
            <p className="mt-2 text-xs text-red-600 font-semibold">
              Beli Lagi
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
