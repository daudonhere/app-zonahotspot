import { create } from "zustand";
import { persist } from "zustand/middleware";
export type InvoiceStatus = "Menunggu Pembayaran" | "Lunas" | "Kadaluarsa" | "Proses";
export type InvoiceCategory = "Pembelian" | "Pembayaran";
export interface InvoiceItem {
  id: string;
  category: InvoiceCategory;
  title: string;
  customerName: string;
  customerId: string;
  email: string;
  packageName: string;
  duration: string;
  date: string;
  dueDate: string;
  expiresAt?: number; 
  status: InvoiceStatus;
  amount: number;
}
interface InvoiceState {
  invoices: InvoiceItem[];
  addInvoice: (invoice: InvoiceItem) => void;
  markAsProcessing: (id: string) => void;
  resetProcessingStatus: () => void;
  removeInvoice: (id: string) => void;
  resetInvoices: () => void;
}
const INITIAL_INVOICES: InvoiceItem[] = [];
export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoices: INITIAL_INVOICES,
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [invoice, ...state.invoices],
        })),
      markAsProcessing: (id) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: "Proses" } : inv
          ),
        })),
      resetProcessingStatus: () =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.status === "Proses" ? { ...inv, status: "Menunggu Pembayaran" } : inv
          ),
        })),
      removeInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),
      resetInvoices: () => set({ invoices: INITIAL_INVOICES }),
    }),
    {
      name: "invoice-storage",
    }
  )
);
