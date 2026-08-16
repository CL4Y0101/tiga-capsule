import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Memory Capsule",
  description: "A cozy digital time capsule of our unforgettable moments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan suppressHydrationWarning di body agar tidak crash karena Ekstensi Browser */}
      <body suppressHydrationWarning className="bg-capsule-cream text-capsule-navy min-h-screen selection:bg-capsule-mutedPink selection:text-capsule-navy font-sans antialiased">
        {children}
      </body>
    </html>
  );
}