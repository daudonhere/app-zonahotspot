"use client";
import CardSection from "./sections/card";
import HistorySection from "./sections/history";
import VoucherCardSection from "./sections/voucher";
export default function HomePage() {
  return (
    <section className="flex flex-col gap-6 px-3 py-6">
      <CardSection />
      <HistorySection />
      <VoucherCardSection />
    </section>
  );
}