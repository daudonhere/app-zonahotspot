"use client";

import WalletSection from "./sections/wallet";
import HistorySection from "./sections/history";
import PromoCardSection from "./sections/promo";

export default function HomePage() {
  return (
    <section className="flex flex-col gap-6 px-3 py-6">
      <WalletSection />
      <HistorySection />
      <PromoCardSection />
    </section>
  );
}