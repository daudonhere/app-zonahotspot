import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8 flex items-center justify-center">
        {/* Background decorative glow */}
        <div className="absolute h-40 w-40 animate-pulse rounded-full bg-primary-theme/20 blur-3xl"></div>
        
        <div className="relative z-10 space-y-2">
            <h1 className="font-nexa text-9xl font-bold tracking-tighter text-primary-theme">
                404
            </h1>
        </div>
      </div>

      <div className="z-10 max-w-[500px] space-y-6">
        <h2 className="font-tommy-regular text-3xl font-bold text-foreground">
          Oops! Halaman Tidak Ditemukan
        </h2>
        
        <p className="font-tommy-regular text-muted-foreground text-lg">
          Sepertinya Anda tersesat. Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link href="/">
            <Button 
              size="lg" 
              className="bg-primary-theme text-white hover:bg-primary-theme/90 font-tommy-regular px-8 rounded-full shadow-lg shadow-primary-theme/20"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative Wifi Icon subtle background */}
      <div className="absolute bottom-10 opacity-5 pointer-events-none">
         <Image 
            src="/icons/wifi.png" 
            alt="Wifi Decoration" 
            width={200} 
            height={200}
            className="grayscale"
         />
      </div>
    </div>
  );
}
