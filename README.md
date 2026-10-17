# 🌊 Thailand Flood Tracker (ระบบติดตามสถานการณ์น้ำและอุทกภัยทั่วประเทศไทย)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)
![Open Data](https://img.shields.io/badge/Open%20Data-HII%20%7C%20RID%20%7C%20GISTDA%20%7C%20BMA%20%7C%20TMD%20%7C%20DOH-blue?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Built with Google Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-8E75C4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)

**ระบบติดตามสถานการณ์น้ำ โทรมาตรเตือนภัย วิเคราะห์ความเสี่ยงอุทกภัย เน้นพื้นที่กรุงเทพมหานคร และครอบคลุมทั่วประเทศ 77 จังหวัด**  
*Bangkok & Thailand Real-Time Multi-Hazard Water Telemetry & Flood Intelligence Dashboard*

**[🇹🇭 ภาษาไทย](#-ภาษาไทย) • [🇬🇧 English](#-english) • [🤖 เครดิต](#-เครดิตการพัฒนา--credits)**

</div>

---

## 🇹🇭 ภาษาไทย

### 📖 เกี่ยวกับโครงการ

> **ศูนย์รวมข้อมูลเตือนภัยน้ำท่วมแบบรวมศูนย์ ครอบคลุมกรุงเทพมหานครและทั่วประเทศไทย — รวบรวมข้อมูลจากหน่วยงานภาครัฐ แสดงผลบนแผนที่แบบเรียลไทม์และข้อมูลอ้างอิงทางการ**

**Thailand Flood Tracker** เป็นแพลตฟอร์มติดตามสถานการณ์อุทกภัยแบบ Multi-Hazard Intelligence ที่รวบรวมข้อมูลจากหน่วยงานภาครัฐชั้นนำ แสดงผลบนแผนที่เชิงโต้ตอบแบบเรียลไทม์ โดยเน้นพื้นที่กรุงเทพมหานคร (BMA DDS 254 เซนเซอร์น้ำท่วมถนน) และขยายครอบคลุมทุกจังหวัดทั่วประเทศ

#### แหล่งข้อมูลและสถานะความสดของข้อมูล (Data Freshness: LIVE vs STATIC)

| # | แหล่งข้อมูล (Provider) | ข้อมูลที่ได้รับ | สถานะข้อมูล (LIVE / STATIC) | ความถี่ / หมายเหตุ |
|---|----------------------|---------------|----------------------------|-------------------|
| 1 | **HII / ThaiWater** (สถาบันสารสนเทศทรัพยากรน้ำ) | ระดับน้ำท่า (ม.รทก.), % ความจุลำน้ำ, ฝนสะสม 24 ชม. ทั่วประเทศ | **LIVE** (มี STATIC fallback หาก API ไม่ตอบสนอง) | อัปเดตทุก 5 นาทีผ่าน Public Open Data API |
| 2 | **BMA DDS** (สำนักการระบายน้ำ กทม.) | 254 เซนเซอร์น้ำท่วมถนนใน กทม., ระดับน้ำท่วมผิวจราจร (ซม.) | **LIVE** | อัปเดตทุก 3 นาที |
| 3 | **RID** (กรมชลประทาน) | ข้อมูลเขื่อนและอ่างเก็บน้ำหลัก 35 แห่ง, ปริมาณกักเก็บ, น้ำไหลเข้า-ออก | **LIVE** (มี STATIC fallback หาก API ไม่ตอบสนอง) | อัปเดตทุก 1 ชม. ผ่าน API กรมชลประทาน |
| 4 | **RainViewer** | เรดาร์ตรวจจับกลุ่มฝนสด พร้อมแอนิเมชัน Timeline ย้อนหลัง | **LIVE** | อัปเดตทุก 5 นาที |
| 5 | **Open-Meteo / ECMWF** | พยากรณ์อากาศล่วงหน้า 7 วัน (อุณหภูมิ, โอกาสฝน, ปริมาณฝน) | **LIVE** | อัปเดตทุก 1 ชม. |
| 6 | **BMA Radar / TMD Radar** | ภาพเรดาร์ตรวจฝน สถานีหนองจอก กทม. (Proxy 3 endpoints) | **LIVE** | ดึงภาพสดทุก 3 นาที |
| 7 | **TMD** (กรมอุตุนิยมวิทยา) | ประกาศเตือนภัยสภาพอากาศ | **LIVE** (เมื่อตั้ง TMD credentials) / **STATIC** fallback | อัปเดตทุก 30 นาที |
| 8 | **GISTDA** (สทอภ.) | ขอบเขตพื้นที่น้ำท่วมจากภาพถ่ายดาวเทียม (GeoJSON) | **LIVE** (เมื่อตั้ง GISTDA_API_KEY) / **STATIC** | ข้อมูลอ้างอิงภาพถ่ายดาวเทียม |
| 9 | **DOH** (กรมทางหลวง) | จุดเตือนน้ำท่วมทางหลวง ผิวจราจร และสถานะรถผ่านได้/ไม่ได้ | **LIVE** (เมื่อตั้ง DOH_API_URL) / **STATIC** | ข้อมูลอ้างอิงจุดเสี่ยงทางหลวงน้ำท่วม |
| 10 | **กองทัพเรือ** (กรมอุทกศาสตร์) | ระดับน้ำทะเลหนุนสูงสุด (ม.รทก.) ปากคลองตลาด และสถานีชายฝั่ง | **STATIC** | ข้อมูลตารางน้ำทำนายรายวันตามรอบน้ำหนุน |
| 11 | **DDPM** (กรมป้องกันและบรรเทาสาธารณภัย) | ทะเบียนศูนย์พักพิงชั่วคราว, ความจุ, เบอร์ติดต่อ | **STATIC** | ข้อมูลทะเบียนศูนย์พักพิงทางการ |
| 12 | **Flash Flood Alerts** (เตือนน้ำป่าไหลหลาก) | จุดเสี่ยงน้ำป่าไหลหลากและดินถล่ม | **STATIC (ซ่อนอยู่โดยค่าเริ่มต้น)** | ปิดการแสดงผลไว้ผ่าน Flag `SHOW_STATIC_FLASH_FLOOD_ALERTS = false` เนื่องจากเป็นชุดข้อมูลตัวอย่างในอดีต (2024-10-06) เพื่อป้องกันความสับสนของผู้ใช้ |

---

### ✨ ฟีเจอร์หลัก

#### 1. 🗺️ แผนที่โทรมาตรเชิงโต้ตอบ (Interactive Telemetry Map)
- สลับดูแผนที่ถนน (OpenStreetMap) หรือภาพดาวเทียม (Esri World Imagery) ได้ทันที
- เลือกดูรายจังหวัด 77 จังหวัดจากเมนูด้านบน พร้อม zoom อัตโนมัติ
- รองรับการ Pinch-to-Zoom ขยายดูบนอุปกรณ์มือถือได้อย่างอิสระ
- **ระบบชั้นข้อมูล (Layer Switcher):**
  - 🏞️ เขื่อนและอ่างเก็บน้ำ (Dams & Reservoirs)
  - ⛺ ศูนย์พักพิงชั่วคราว (Evacuation Shelters)
  - 🚧 จุดเตือนน้ำท่วมทางหลวง (Highway Flood Alerts)
  - 🚗 จุดตรวจวัดน้ำท่วมถนน BMA 254 จุด (เฉพาะ กทม.)
  - 🌧️ เรดาร์ตรวจฝนสด RainViewer + Timeline Scrubber
  - 💨 กระแสลมมรสุม (Wind Flow Vectors)
  - ☁️ ภาพดาวเทียมกลุ่มเมฆสด (NASA GIBS)
  - 🛰️ พื้นที่น้ำท่วม GISTDA (ปรับความโปร่งแสงได้)
  - 🌐 เส้นขอบเขตการปกครอง

#### 2. 📋 ฟีดรายการสถานีและสรุปสถานการณ์ (Categorized Feed)
- สลับมุมมอง **"แผนที่"** ↔ **"รายการ"** จากแถบด้านบน
- สรุปตัวเลข 4 มิติ: สถานีวิกฤต, เฝ้าระวัง, เส้นทางถูกปิด, ความจุเขื่อน
- การ์ดข้อมูลแยกหมวดหมู่ พร้อมปุ่ม **"เปิดดูในแผนที่"**

#### 3. 🔍 ค้นหาและตัวกรอง (Search & Filters)
- ค้นหาสถานี, ลำน้ำ, ถนน หรือรหัสสถานีได้ทันที
- กรองตามจังหวัด / อำเภอ / เขต (สำหรับ กทม.)
- กรองตามระดับความรุนแรง (ปกติ → เฝ้าระวัง → เตือนภัย → วิกฤต)
- Auto-refresh ทุก 60 วินาที + ปุ่มรีเฟรชด้วยตนเอง

#### 4. 📊 วิเคราะห์รายละเอียดเชิงลึก (Detail Drawer)
- **สถานีวัดน้ำ:** ระดับน้ำเทียบตลิ่ง, กราฟสเกลจำลอง, ปริมาณฝนสะสม
- **เซนเซอร์น้ำท่วมถนน (BMA):** ระดับน้ำท่วมผิวจราจร (ซม.), สถานะรถเล็กผ่านได้/ไม่ได้
- **เขื่อน:** % ความจุ, อัตราน้ำไหลเข้า-ออก, ปริมาณน้ำกักเก็บ
- **น้ำทะเลหนุน:** ระดับน้ำขึ้นสูงสุดรอบเช้า-เย็น
- **ศูนย์พักพิง:** จำนวนรองรับ, สิ่งอำนวยความสะดวก, ปุ่มโทรประสานงาน

#### 5. 📡 เรดาร์ตรวจฝน กทม. (BMA Radar Modal)
- ภาพเรดาร์สดจากสถานีหนองจอก สำนักการระบายน้ำ กทม.
- รองรับ 3 แหล่งข้อมูลสำรองแบบ Proxy
- ซูมเข้า-ออก + รีเฟรชอัตโนมัติ

#### 6. 🌤️ พยากรณ์อากาศล่วงหน้า 7 วัน (Weather Forecast)
- ข้อมูลจาก Open-Meteo / ECMWF
- โอกาสฝนตก (%), ปริมาณฝนสะสม (มม.), อุณหภูมิรายชั่วโมงและรายวัน

#### 7. 📞 สายด่วนฉุกเฉิน 24 ชม.
- **1784:** สายด่วน ปภ. แจ้งเหตุน้ำท่วม ขอเรืออพยพ
- **1669:** การแพทย์ฉุกเฉิน (EMS)
- **1586:** กรมทางหลวง สอบถามเส้นทาง

#### 8. 📍 สถานะรายจังหวัดทั่วประเทศ (Province Status)
- สรุปสถานะ 77 จังหวัด: NORMAL / WATCH / WARNING / FLOODING / CRITICAL
- คำนวณจากหลักฐานจริง: ระดับน้ำสถานีโทรมาตร + ปริมาณฝน 24 ชม. + สภาพเส้นทางคมนาคม
- เกณฑ์ระดับฝนสะสม 24 ชม. อิงตามเกณฑ์กรมอุตุนิยมวิทยา (ฝนปานกลาง 10-35 มม., ฝนหนัก 35-90 มม., ฝนหนักมาก ≥90 มม.) ส่วนเกณฑ์ประเมินสถานะความเสี่ยงรายจังหวัด (Province status) เป็นเกณฑ์ที่กำหนดขึ้นภายในโครงการ มิใช่เกณฑ์ทางการของหน่วยงานภาครัฐ

---

### 🏗️ สถาปัตยกรรมระบบ (Architecture)

```text
┌──────────────────────────────────────────────────────────────┐
│                         Client (Browser)                      │
│  Next.js 14 (App Router) + React 18 + Leaflet + Tailwind CSS │
└───────────────┬───────────────────────────────┬───────────────┘
                │ SSR / ISR                     │ Client API
                ▼                               ▼
┌───────────────────────────────┐  ┌──────────────────────────┐
│      Server Components        │  │      API Routes           │
│  page.tsx (SSR with cache)    │  │  /api/nationwide          │
│                               │  │  /api/nationwide/status   │
│  getAggregatedNationwideData()│  │  /api/provinces           │
│                               │  │  /api/provinces/[id]      │
└───────────────┬───────────────┘  │  /api/bma/radar (proxy)   │
                │                  └──────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│              Aggregation Layer (nationwide.ts)                 │
│  Promise.allSettled → Failure Isolation → Cache Merge          │
└───────────────┬───────────────────────────────────────────────┘
                │
    ┌───────────┼───────────┬──────────┬──────────┐
    ▼           ▼           ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ThaiWater│ │  RID   │ │  BMA   │ │  TMD   │ │ GISTDA │ ...
│(HII)   │ │ Dams   │ │ DDS    │ │Warnings│ │Satellite│
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
  ↑ Server-side Cache (getWithCache) with TTL per provider
```

---

### 🚀 การติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. โคลนคลังโค้ด
git clone https://github.com/Noobmaster-3443/Thailand-Flood-Tracker.git
cd Thailand-Flood-Tracker

# 2. ติดตั้ง Dependencies
npm install

# 3. รันโหมด Development
npm run dev
```

เปิดดูในเบราว์เซอร์:
- หน้าเว็บหลัก: `http://localhost:3000`
- หน้าสรุปรายพื้นที่: `http://localhost:3000/area`

### 🔧 Environment Variables (ตัวแปรสภาพแวดล้อม)

ระบบสามารถทำงานได้ทันทีโดย**ไม่จำเป็นต้องตั้งค่า Environment Variable ใดๆ** (Zero Configuration) สำหรับผู้ดูแลระบบที่ต้องการเชื่อมต่อ API ทางการโดยตรง สามารถระบุตัวแปรเพิ่มเติมในไฟล์ `.env` ได้ดังนี้:

- `GISTDA_API_KEY`: API Key สำหรับดึงข้อมูลขอบเขตน้ำท่วมดาวเทียมสดจาก GISTDA (Optional)
- `GISTDA_API_URL`: URL ปลายทางของ GISTDA Flood Extent API (Optional)
- `TMD_API_UID`: UID สำหรับเข้าถึง TMD Weather Warning API (Optional)
- `TMD_API_KEY`: API Key สำหรับเข้าถึง TMD Weather Warning API (Optional)
- `DOH_API_URL`: Custom API endpoint สำหรับดึงข้อมูลน้ำท่วมทางหลวง (Optional)

---

### 📦 Tech Stack

| เทคโนโลยี | เวอร์ชัน | ใช้งาน |
|-----------|---------|-------|
| Next.js | 14.2 | App Router, SSR, API Routes |
| React | 18.3 | UI Components |
| TypeScript | 5.6 | Type Safety |
| Leaflet | 1.9 | Interactive Maps |
| Tailwind CSS | 3.4 | Styling |
| Lucide React | 0.453 | Icons |
| Vercel | — | Deployment & Edge Network |

---

## 🇬🇧 English

### 📖 About

> **Real-time Multi-Hazard Flood Intelligence Dashboard covering Bangkok (BMA 254 road-flood sensors) and all 77 provinces of Thailand**

**Thailand Flood Tracker** aggregates live telemetry data from official Thai government agencies into a single interactive map dashboard.

#### Data Providers & Freshness (LIVE vs STATIC)

- **ThaiWater (HII)**: Real-time river gauges & 24h rainfall (**LIVE**, static fallback if API fails)
- **BMA DDS**: 254 real-time road-flood sensors across Bangkok (**LIVE**)
- **RID (Royal Irrigation Dept.)**: 35 major reservoirs nationwide with capacity and inflow/outflow (**LIVE**, static fallback if API fails)
- **RainViewer**: Live weather radar composite and timeline animation (**LIVE**)
- **Open-Meteo / ECMWF**: 7-day weather forecast (**LIVE**)
- **BMA / TMD Radar**: High-resolution Nong Chok radar station feed (**LIVE**)
- **TMD (Thai Met Dept.)**: Severe weather disaster warnings (**LIVE** if credentials set, otherwise verified **STATIC**)
- **GISTDA**: Satellite radar flood extent GeoJSON (**LIVE** if API key set, otherwise verified **STATIC**)
- **DOH (Dept. of Highways)**: Road flood alerts (**LIVE** if API endpoint set, otherwise verified **STATIC**)
- **Royal Thai Navy**: Predicted daily tidal peak at Bangkok Pak Khlong Talat and coastal stations (**STATIC**)
- **DDPM**: Evacuation shelters registry with capacities and contacts (**STATIC**)
- **Flash Flood Alerts**: Mountain runoff and flash flood early warnings (**STATIC - Hidden by default** via `SHOW_STATIC_FLASH_FLOOD_ALERTS = false` in [src/types/telemetry.ts](file:///c:/Users/chatp/Thailand-Flood-Tracker/src/types/telemetry.ts) because data is static historical sample from 2024-10-06)

### Local Setup

```bash
git clone https://github.com/Noobmaster-3443/Thailand-Flood-Tracker.git
cd Thailand-Flood-Tracker
npm install
npm run dev
```

---

## 🤖 เครดิตการพัฒนา / Credits

- **พัฒนาและออกแบบร่วมกับ:** **Google Gemini** (Gemini AI Models by **Google DeepMind**)
- **สัญญาอนุญาต:** เผยแพร่ภายใต้ **MIT License** เพื่อสาธารณประโยชน์และการกู้ภัยพิบัติ

---

### 🙏 ข้อความจากผู้จัดทำ / Disclaimer

> **🇹🇭 หมายเหตุ:** โครงการนี้จัดทำขึ้นด้วยความตั้งใจเพื่อเป็นประโยชน์ต่อพี่น้องประชาชนชาวไทยและผู้ประสบภัยพิบัติ ข้อมูลที่แสดงผลเป็นข้อมูลจากหน่วยงานราชการที่เปิดเผยต่อสาธารณะ หากมีข้อผิดพลาดหรือข้อบกพร่องประการใด คณะผู้จัดทำต้องขออภัยมา ณ ที่นี้ด้วยครับ ท่านสามารถร่วมแจ้งปัญหาหรือเสนอแนะการปรับปรุงเพิ่มเติมผ่านทาง GitHub Issues ได้ตลอดเวลาครับ
>
> **🇬🇧 Disclaimer:** This project was built with the intention to help Thai citizens and disaster relief efforts. All data is sourced from publicly available government open data APIs. If there are any errors or inaccuracies, we sincerely apologize. Feedback and contributions are always welcome via GitHub Issues.
