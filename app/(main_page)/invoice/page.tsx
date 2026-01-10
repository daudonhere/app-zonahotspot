"use client";
import { useInvoiceStore, InvoiceItem } from "@/stores/invoiceStore";
import { Wifi, Calendar, Trash2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
const CONTACT_INFO = {
  waNumber: "6285117534914",
};
export default function InvoicePage() {
  const { invoices, markAsProcessing, resetProcessingStatus, removeInvoice } = useInvoiceStore();
  const [isMounted, setIsMounted] = useState(false);
  const [paymentInvoice] = useState<InvoiceItem>(() => ({
    id: "INV-2025000123",
    category: "Pembayaran",
    title: "Tagihan Bulanan",
    customerName: "Saepul",
    customerId: "ZH-0098123",
    email: "john.doe@email.com",
    packageName: "Nyaman (30 Mbps)",
    duration: "1 Bulan",
    date: "26 Des 2025",
    dueDate: "27 Des 2025, 23:59",
    expiresAt: Date.now() + 86400000, 
    status: "Menunggu Pembayaran",
    amount: 200000,
  }));
  const allInvoices = [paymentInvoice, ...invoices.filter(inv => inv.category === "Pembelian" || inv.id.includes("-"))];
  useEffect(() => {
    setIsMounted(true);
    resetProcessingStatus();
  }, [resetProcessingStatus]);
  if (!isMounted) return null;
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-extrabold text-foreground">Tagihan Anda</h1>
        <p className="text-sm text-muted-foreground">Daftar tagihan yang perlu dibayarkan</p>
      </div>
      <div className="flex flex-col gap-6">
        {allInvoices.length > 0 ? (
          allInvoices.map((invoice, index) => (
            <InvoicePaper
              key={invoice.id}
              data={invoice}
              index={index}
              onPay={() => {
                if (invoice.id === paymentInvoice.id) {
                    toast.success("Status diperbarui ke Proses (Demo)");
                } else {
                    markAsProcessing(invoice.id);
                }
              }}
              onDelete={() => {
                if (invoice.id === paymentInvoice.id) {
                     toast.error("Tagihan wajib tidak dapat dihapus");
                } else {
                    removeInvoice(invoice.id);
                    toast.success("Invoice berhasil dihapus");
                }
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm font-medium">Belum ada tagihan</p>
          </div>
        )}
      </div>
    </div>
  );
}
function InvoicePaper({ data, index, onPay, onDelete }: { data: InvoiceItem; index: number; onPay: () => void; onDelete: () => void; }) {
  const isExpired = data.status === "Kadaluarsa";
  const isPaid = data.status === "Lunas";
  const isDisabled = isExpired || isPaid;
  const isProcessing = data.status === "Proses";
  const [timeLeft, setTimeLeft] = useState<string>("");
  useEffect(() => {
    if (!data.expiresAt || data.status !== "Menunggu Pembayaran") return;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = data.expiresAt! - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data.expiresAt, data.status]);
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(data.amount);
  const isPembelian = data.category === "Pembelian";
  let message = "";
  if (isPembelian) {
    message = `[PEMBELIAN]
Hallo, Admin!
Saya ingin melakukan pembelian paket internet dengan detail berikut :
Invoice: ${data.id}
Nama : ${data.customerName}
Paket Layanan : ${data.packageName}
Tipe Pembayaran : prepaid
Jumlah : ${formattedAmount}
mohon untuk info tindakan lebih lanjut ya !`;
  } else {
    message = `[PEMBAYARAN]
Halo admin, saya ingin melakukan pembayaran langganan paket internet dengan rincian berikut:
Invoice: ${data.id}
Nama : ${data.customerName}
Paket Layanan : ${data.packageName}
Tipe Pembayaran : prepaid
Jatuh Tempo : ${data.dueDate}
Jumlah : ${formattedAmount}
mohon informasi lebih lanjut ya!`;
  }
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.waNumber}?text=${encodeURIComponent(message)}`;
  let badgeColor = "bg-primary-theme/10 text-primary-theme";
  if (isExpired) badgeColor = "bg-gray-200 text-gray-600";
  if (isPaid) badgeColor = "bg-green-100 text-green-700";
  if (isProcessing) badgeColor = "bg-yellow-100 text-yellow-700";
  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-xl bg-background shadow-lg transition-transform hover:scale-[1.01] border border-ring/20 ${
        isDisabled ? "opacity-75 grayscale" : ""
      }`}
      style={{ zIndex: 10 - index }}
    >
      <div className={`h-2 w-full ${isDisabled ? "bg-gray-400" : isProcessing ? "bg-yellow-500" : "bg-primary-theme"}`} />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="text-primary-theme">
                <Ticket size={24} className="fill-current" />
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  {(data.category || "Pembayaran").toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground leading-none">
                  {data.packageName}
                </span>
             </div>
          </div>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${badgeColor}`}>
            {data.status.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 text-sm border border-ring/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wifi size={14} />
              <span>Speed</span>
            </div>
            <span className="font-semibold">{data.packageName === "Basic" ? "10 Mbps" : data.packageName === "Aktif" ? "20 Mbps" : data.packageName === "Nyaman" ? "30 Mbps" : data.packageName === "Andal" ? "50 Mbps" : data.packageName === "Prima" ? "100 Mbps" : data.packageName === "Maksimal" ? "200 Mbps" : data.packageName}</span>
          </div>
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span>Periode</span>
            </div>
            <span className="font-semibold">{data.duration}</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground items-end">
          <div className="flex flex-col gap-0.5">
            <span>No: {data.id}</span>
            <span className="font-medium text-foreground">Jatuh Tempo: {data.dueDate}</span>
          </div>
          {timeLeft && !isProcessing && !isDisabled && (
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold uppercase text-red-400">Bayar Dalam</span>
              <span className="text-sm font-black text-red-500 tabular-nums leading-none">{timeLeft}</span>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex w-full items-center justify-between">
        <div className="h-4 w-4 -ml-2 rounded-full bg-secondary shadow-inner" />
        <div className="h-[1px] w-full border-t-2 border-dashed border-gray-300" />
        <div className="h-4 w-4 -mr-2 rounded-full bg-secondary shadow-inner" />
      </div>
      <div className="flex items-center justify-between bg-muted/20 p-5">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Total Tagihan</span>
          <span className="text-lg font-extrabold text-foreground">{formattedAmount}</span>
        </div>
        {isDisabled ? (
          <div className="flex gap-2">
            <button disabled className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-500">
              {isExpired ? "Kadaluarsa" : "Lunas"}
            </button>
            <button onClick={onDelete} className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onPay}
            className={`rounded-lg px-8 py-2.5 text-sm font-black transition-all active:scale-95 ${
              isProcessing ? "bg-yellow-500 text-white" : "bg-primary-theme text-primary-theme-foreground shadow-md"
            }`}
          >
            {isProcessing ? "Sedang Proses" : "Bayar"}
          </a>
        )}
      </div>
    </div>
  );
}