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
  title: "ระบบติดตามสถานการณ์น้ำและอุทกภัยทั่วประเทศ 77 จังหวัด | Thailand Flood Tracker",
  description:
    "แผนที่และระบบติดตามสถานการณ์น้ำ ระดับน้ำในแม่น้ำ-ลำคลอง ปริมาณฝนสะสม และสถานะเขื่อนกักเก็บน้ำ ครอบคลุม 77 จังหวัดทั่วประเทศไทย จากคลังข้อมูลน้ำแห่งชาติ (สสน.), กรมชลประทาน, กรมอุตุนิยมวิทยา และกรมทางหลวง",
  keywords: [
    "น้ำท่วมทั่วประเทศ",
    "สถานการณ์น้ำท่วม",
    "Thailand Flood Tracker",
    "เช็กระดับน้ำ",
    "เรดาร์ฝน",
    "สถานการณ์น้ำแม่น้ำเจ้าพระยา",
    "น้ำท่วมกรุงเทพ",
    "รายงานน้ำท่วม 77 จังหวัด",
    "กรมชลประทาน",
    "สสน.",
    "ThaiWater",
  ],
  authors: [{ name: "Thailand Open Water Data Community" }],
  openGraph: {
    title: "ระบบติดตามสถานการณ์น้ำและอุทกภัยทั่วประเทศ 77 จังหวัด (Thailand Flood Tracker)",
    description: "เช็กระดับน้ำโทรมาตรสด ปริมาณน้ำฝน 24 ชม. เส้นทางสัญจร และอ่างเก็บน้ำทั่วประเทศ",
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
