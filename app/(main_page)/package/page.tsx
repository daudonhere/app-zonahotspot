"use client";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Wifi, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvoiceStore, InvoiceItem } from "@/stores/invoiceStore";
import { toast } from "sonner";
import { PACKAGE_ENDPOINTS } from "@/libs/api/endpoints";
import { getFullApiUrl } from "@/libs/api/utils";
import { useAuth } from "@/stores/authStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/libs/api/client";
import { Skeleton } from "@/components/ui/skeleton";
interface ApiPackage {
  id: string;
  package: string;
  speed: string;
  type: string;
  duration: string;
  price: string;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
interface PackageResponse {
  result: {
    data: ApiPackage[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  code?: number;
  message?: string;
}
function generateInvoiceId(date: Date) {
  return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}
export default function PackagePage() {
  const [search, setSearch] = useState("");
  const [allPackages, setAllPackages] = useState<ApiPackage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const itemsPerPage = 10;
  const router = useRouter();
  const { addInvoice } = useInvoiceStore();
  const { user, accessToken } = useAuth(); 
  const { startLoading, stopLoading } = useLoaderStore();
  useEffect(() => {
    const fetchAllPackages = async () => {
      if (!accessToken) return;
      try {
        setIsDataLoading(true);
        startLoading();
        const url = new URL(getFullApiUrl(PACKAGE_ENDPOINTS.LIST), window.location.origin);
        url.searchParams.append("page", "1");
        url.searchParams.append("pageSize", "100"); 
        const response = await fetchWithAuth(url.toString());
        const data: PackageResponse = await response.json();
        if (response.ok && data.result) {
          setAllPackages(data.result.data || []);
        } else {
           toast.error(data.message || "Gagal mengambil data paket");
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Session expired") {
          toast.error("Sesi habis, silakan login kembali");
          router.push("/auth");
        } else {
          console.error("Error fetching packages:", error);
          toast.error("Gagal mengambil data paket");
        }
      } finally {
        setIsDataLoading(false);
        stopLoading();
      }
    };
    fetchAllPackages();
  }, [accessToken, startLoading, stopLoading, router]);
  const filteredPackages = useMemo(() => {
    setCurrentPage(1); 
    const term = search.toLowerCase();
    if (!term) return allPackages;
    return allPackages.filter((pkg) => {
      return (
        pkg.package.toLowerCase().includes(term) ||
        pkg.price.toString().includes(term) ||
        pkg.speed.toLowerCase().includes(term) ||
        pkg.duration.toLowerCase().includes(term) ||
        pkg.type.toLowerCase().includes(term)
      );
    });
  }, [allPackages, search]);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const displayedPackages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(start, start + itemsPerPage);
  }, [filteredPackages, currentPage]);
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };
  const handleSelectPackage = (pkg: ApiPackage) => {
    const now = new Date();
    let durationMs = 60 * 60 * 1000; 
    if (pkg.duration.toLowerCase().includes('bulan')) durationMs = 30 * 24 * 60 * 60 * 1000;
    if (pkg.duration.toLowerCase().includes('hari')) durationMs = 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now.getTime() + durationMs);
    const dateStr = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    }).format(now);
    const timeStr = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(expiresAt);
    const invoiceId = generateInvoiceId(now);
    const newInvoice: InvoiceItem = {
      id: invoiceId,
      category: "Pembelian",
      title: "Pembelian Paket",
      customerName: user?.fullname || "Guest",
      customerId: user?.id || "N/A",
      email: user?.email || "",
      packageName: pkg.package,
      duration: `1 ${pkg.duration}`,
      date: dateStr,
      dueDate: `${dateStr}, ${timeStr}`,
      expiresAt: expiresAt.getTime(),
      status: "Menunggu Pembayaran",
      amount: parseFloat(pkg.price),
    };
    addInvoice(newInvoice);
    toast.success("Invoice berhasil dibuat");
    router.push("/invoice");
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      {/* Redesigned Floating Sticky Header */}
      <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border/10 px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto w-full relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary-theme" />
          </div>
          <Input
            placeholder="Cari paket, harga, atau durasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 h-11 text-sm bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary-theme/20 focus:border-primary-theme transition-all rounded-full shadow-inner"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 w-full px-3 py-4">
        <div className="max-w-5xl mx-auto">
          {isDataLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <PackageSkeleton key={i} />
              ))}
            </div>
          ) : displayedPackages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary-theme p-3 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-background/80 bg-background/10 px-1.5 py-0.5 rounded">
                        {pkg.type}
                      </span>
                      <Wifi className="h-3.5 w-3.5 text-background/70" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-background/90 tracking-wide uppercase truncate">
                        {pkg.package}
                      </h3>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black tracking-tight text-background">
                          {pkg.speed}
                        </span>
                        <span className="text-[10px] font-medium text-background/80">Mbps</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-background/20">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-background/70 font-medium">Harga</span>
                        <div className="flex flex-wrap items-baseline gap-x-1">
                            <span className="text-sm font-bold text-background">
                            {formatPrice(pkg.price)}
                            </span>
                            <span className="text-[10px] text-background/70 whitespace-nowrap">
                             / {pkg.duration}
                            </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSelectPackage(pkg)}
                        className="w-full rounded-lg h-8 text-xs font-black bg-background text-primary-theme hover:bg-background/90 shadow-sm"
                      >
                        Pilih
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Wifi className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {search ? "Paket tidak ditemukan" : "Belum ada paket tersedia"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                {search ? `Tidak ada hasil untuk "${search}"` : "Silakan cek kembali nanti."}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Pagination Footer - Only shown if filtered items > 10 */}
      {!isDataLoading && filteredPackages.length > itemsPerPage && (
        <div className="sticky bottom-0 z-20 w-full bg-background/95 backdrop-blur-sm border-t border-border/40 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border/60 hover:border-primary-theme hover:text-primary-theme transition-colors"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center px-4 h-9 rounded-full bg-muted/50 min-w-[5rem]">
                <span className="text-xs font-black text-foreground">
                  {currentPage} <span className="text-muted-foreground font-medium mx-1">/</span> {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border/60 hover:border-primary-theme hover:text-primary-theme transition-colors"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function PackageSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-muted/20 p-3 h-[160px] border border-border/5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-3 w-16" />
        <div className="flex items-baseline gap-1 mt-1">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-muted/10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
