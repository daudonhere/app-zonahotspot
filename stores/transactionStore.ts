import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface InvoiceData {
  invoiceId: string;
  date: string;
  status: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
  packageName: string;
  duration: string;
  amount: number;
  formattedAmount: string;
}
export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  accountNumber: string;
  accountName: string;
}
interface TransactionState {
  invoiceData: InvoiceData | null;
  selectedPaymentMethod: PaymentMethod | null;
  setInvoiceData: (data: InvoiceData) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  resetTransaction: () => void;
}
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      invoiceData: null,
      selectedPaymentMethod: null,
      setInvoiceData: (data) => set({ invoiceData: data }),
      setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
      resetTransaction: () => set({ invoiceData: null, selectedPaymentMethod: null }),
    }),
    {
      name: "transaction-storage",
    }
  )
);
