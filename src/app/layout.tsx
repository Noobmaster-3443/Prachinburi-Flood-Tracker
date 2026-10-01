import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบรายงานสถานการณ์น้ำท่วมปราจีนบุรี | Prachinburi Flood Tracker",
  description:
    "แผนที่และระบบรายงานสถานการณ์น้ำท่วมแบบเรียลไทม์จากประชาชนและภาครัฐ จังหวัดปราจีนบุรี (กบินทร์บุรี, เมืองปราจีนบุรี, บ้านสร้าง, ศรีมหาโพธิ ฯลฯ)",
  keywords: [
    "น้ำท่วมปราจีนบุรี",
    "กบินทร์บุรี น้ำท่วม",
    "น้ำท่วม 304",
    "บ้านสร้าง น้ำท่วม",
    "Prachinburi Flood",
    "สายด่วนกู้ภัยปราจีนบุรี",
    "รายงานน้ำท่วม",
  ],
  authors: [{ name: "Prachinburi Community & Rescue Volunteers" }],
  openGraph: {
    title: "ระบบรายงานสถานการณ์น้ำท่วมปราจีนบุรี (Prachinburi Flood Tracker)",
    description: "เช็กระดับน้ำ เส้นทางสัญจร จุดน้ำท่วมสูง และขอความช่วยเหลือฉุกเฉิน",
    type: "website",
    locale: "th_TH",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${ibmPlex.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
