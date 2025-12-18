export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <h1 className="text-xl font-extrabold text-primary-theme">
          Kamu sedang offline
        </h1>
        <p className="text-sm text-secondary-theme-foreground">
          Periksa koneksi internet dan coba lagi.
        </p>
      </div>
    </div>
  );
}
