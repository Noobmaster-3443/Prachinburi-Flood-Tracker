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

> **ศูนย์รวมข้อมูลเตือนภัยน้ำท่วมแบบรวมศูนย์ ครอบคลุมกรุงเทพมหานครและทั่วประเทศไทย — รวบรวมข้อมูลจาก 10+ หน่วยงานราชการ แสดงผลบนแผนที่แบบเรียลไทม์**

**Thailand Flood Tracker** เป็นแพลตฟอร์มติดตามสถานการณ์อุทกภัยแบบ Multi-Hazard Intelligence ที่รวบรวมข้อมูลจากหน่วยงานภาครัฐชั้นนำ แสดงผลบนแผนที่เชิงโต้ตอบแบบเรียลไทม์ โดยเน้นพื้นที่กรุงเทพมหานคร (BMA DDS 254 เซนเซอร์น้ำท่วมถนน) และขยายครอบคลุมทุกจังหวัดทั่วประเทศ

#### แหล่งข้อมูลที่เชื่อมต่อ (11 Providers)

| # | แหล่งข้อมูล | ข้อมูลที่ได้รับ | ความถี่ |
|---|------------|---------------|--------|
| 1 | **HII / ThaiWater** (สถาบันสารสนเทศทรัพยากรน้ำ) | ระดับน้ำท่า (ม.รทก.), % ความจุลำน้ำ, ฝนสะสม 24 ชม. | 5 นาที |
| 2 | **RID** (กรมชลประทาน) | ข้อมูลเขื่อนและอ่างเก็บน้ำหลัก, อัตราน้ำไหลเข้า-ออก | 1 ชม. |
| 3 | **BMA DDS** (สำนักการระบายน้ำ กทม.) | 254 เซนเซอร์น้ำท่วมถนนใน กทม., ระดับน้ำท่วมผิวจราจร (ซม.) | 3 นาที |
| 4 | **TMD** (กรมอุตุนิยมวิทยา) | ประกาศเตือนภัยพิบัติ, เรดาร์ตรวจฝน | 30 นาที |
| 5 | **GISTDA** (สทอภ.) | ขอบเขตพื้นที่น้ำท่วมจากดาวเทียมเรดาร์ | 1 วัน |
| 6 | **DOH** (กรมทางหลวง) | จุดเตือนน้ำท่วมผิวจราจรบนทางหลวง, สถานะรถผ่านได้/ไม่ได้ | 10 นาที |
| 7 | **กองทัพเรือ** (กรมอุทกศาสตร์) | ระดับน้ำทะเลหนุน, ช่วงเวลาเฝ้าระวังน้ำดันย้อน | 1 วัน |
| 8 | **DDPM** (กรมป้องกันและบรรเทาสาธารณภัย) | ศูนย์พักพิงอพยพ, ความจุ, เบอร์ติดต่อประสานงาน | Static |
| 9 | **Open-Meteo / ECMWF** | พยากรณ์อากาศ 7 วัน, โอกาสฝนตก, อุณหภูมิ | 1 ชม. |
| 10 | **RainViewer** | เรดาร์กลุ่มฝนสด + แอนิเมชัน Timeline 2 ชม. | 5 นาที |
| 11 | **BMA Radar / TMD Radar** | ภาพเรดาร์ตรวจฝน สถานีหนองจอก กทม. | 3 นาที |

---

### ✨ ฟีเจอร์หลัก

#### 1. 🗺️ แผนที่โทรมาตรเชิงโต้ตอบ (Interactive Telemetry Map)
- แผนที่เป็นจุดสนใจหลัก — Zero UI Clutter
- สลับดูแผนที่ถนน (OpenStreetMap) หรือภาพดาวเทียม (Esri World Imagery) ได้ทันที
- เลือกดูรายจังหวัด 77 จังหวัดจากเมนูด้านบน พร้อม zoom อัตโนมัติ
- **ระบบชั้นข้อมูล (Layer Switcher):**
  - 🏞️ เขื่อนและอ่างเก็บน้ำ (Dams & Reservoirs)
  - ⛰️ จุดเตือนภัยน้ำป่าไหลหลาก (Flash Flood Alerts)
  - ⛺ ศูนย์พักพิงชั่วคราว (Evacuation Shelters)
  - 🚧 จุดเตือนน้ำท่วมทางหลวง (Highway Flood Alerts)
  - 🚗 จุดตรวจวัดน้ำท่วมถนน BMA 254 จุด (เฉพาะ กทม.)
  - 🌧️ เรดาร์ตรวจฝนสด + Timeline Scrubber
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
- **เขื่อน:** % ความจุ, อัตราน้ำไหลเข้า-ออก, การแจ้งเตือนท้ายเขื่อน
- **น้ำทะเลหนุน:** ระดับน้ำขึ้นสูงสุดรอบเช้า-เย็น
- **ศูนย์พักพิง:** จำนวนรองรับ, สิ่งอำนวยความสะดวก, ปุ่มโทรประสานงาน

#### 5. 📡 เรดาร์ตรวจฝน กทม. (BMA Radar Modal)
- ภาพเรดาร์สดจากสถานีหนองจอก สำนักการระบายน้ำ กทม.
- รองรับ 3 แหล่งข้อมูลสำรอง (BMA High-Res → BMA Standard → TMD)
- ซูมเข้า-ออก + รีเฟรชอัตโนมัติ + ลิงก์ไปเว็บทางการ
- Error fallback พร้อมปุ่มลองใหม่หากโหลดไม่ได้

#### 6. 🌤️ พยากรณ์อากาศล่วงหน้า 7 วัน (Weather Forecast)
- ข้อมูลจาก Open-Meteo / ECMWF
- โอกาสฝนตก (%), ปริมาณฝนสะสม (มม.), อุณหภูมิ
- เจาะลึกรายพื้นที่

#### 7. 📞 สายด่วนฉุกเฉิน 24 ชม.
- **1784:** สายด่วน ปภ. แจ้งเหตุน้ำท่วม ขอเรืออพยพ
- **1669:** การแพทย์ฉุกเฉิน (EMS)
- **1586:** กรมทางหลวง สอบถามเส้นทาง

#### 8. 📍 สถานะรายจังหวัดทั่วประเทศ (Province Status)
- สรุปสถานะ 77 จังหวัด: NORMAL / WATCH / WARNING / FLOODING / CRITICAL
- คำนวณจากข้อมูลจริง: ระดับน้ำ + ปริมาณฝน + เส้นทางถูกปิด + เขื่อน

---

### 🏗️ สถาปัตยกรรมระบบ (Architecture)

```
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

### 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
thailand-flood-tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bma/radar/route.ts          # Proxy เรดาร์ กทม. (3 แหล่งสำรอง)
│   │   │   ├── nationwide/
│   │   │   │   ├── route.ts                # API ข้อมูลรวมทั่วประเทศ
│   │   │   │   └── status/route.ts         # API สถานะย่อ 77 จังหวัด
│   │   │   └── provinces/
│   │   │       ├── route.ts                # API รายชื่อจังหวัด
│   │   │       └── [provinceId]/route.ts   # API ข้อมูลรายจังหวัด
│   │   ├── area/page.tsx                   # หน้าสรุปรายพื้นที่
│   │   ├── globals.css                     # Tailwind + Leaflet Animations
│   │   ├── layout.tsx                      # Root Layout + Metadata + Fonts
│   │   └── page.tsx                        # หน้าหลัก (Map + Feed + Modals)
│   │
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── MetricBanner.tsx            # การ์ดสรุปสถิติ + น้ำหนุน/น้ำป่า
│   │   │   └── ProvinceStatusCard.tsx      # การ์ดสถานะรายจังหวัด
│   │   ├── Emergency/
│   │   │   └── EmergencyDrawer.tsx         # สายด่วนฉุกเฉิน 1784/1669/1586
│   │   ├── Feed/
│   │   │   └── TelemetryStationFeedList.tsx # ฟีดรายการสถานี เขื่อน ศูนย์พักพิง
│   │   ├── Filters/
│   │   │   └── TelemetryFilterBar.tsx      # ค้นหาและตัวกรอง
│   │   ├── Map/
│   │   │   ├── DynamicTelemetryMap.tsx     # Dynamic Import (SSR-safe Leaflet)
│   │   │   ├── RadarAnimationPlayer.tsx    # เรดาร์ฝน RainViewer + Timeline
│   │   │   └── TelemetryMap.tsx            # แผนที่หลัก + Layer System
│   │   ├── Navbar/
│   │   │   └── TelemetryNavbar.tsx         # แถบนำทาง + ปุ่มเรดาร์ กทม.
│   │   ├── Radar/
│   │   │   └── BmaRadarModal.tsx           # Modal เรดาร์ สำนักการระบายน้ำ กทม.
│   │   ├── ReportDrawer/
│   │   │   └── TelemetryDetailDrawer.tsx   # วิเคราะห์เชิงลึกรายสถานี
│   │   └── Weather/
│   │       ├── WeatherForecastModal.tsx     # พยากรณ์ 7 วัน (Open-Meteo)
│   │       └── WeatherQuickWidget.tsx      # วิดเจ็ตอากาศย่อ
│   │
│   ├── data/
│   │   ├── emergency-contacts.ts           # รายชื่อเบอร์โทรฉุกเฉิน
│   │   ├── nationwide-telemetry.ts         # Static dataset ทั่วประเทศ (fallback)
│   │   ├── open-data-telemetry.ts          # ข้อมูลโทรมาตรเขื่อน/ศูนย์พักพิง
│   │   ├── thailand-provinces.ts           # รายชื่อ 77 จังหวัดพร้อมพิกัด
│   │   ├── prachinburi-districts.json      # GeoJSON ขอบเขต 7 อำเภอ ปราจีนบุรี
│   │   ├── prachinburi-subdistricts.json   # GeoJSON ตำบล
│   │   └── prachinburi-locations.ts        # ข้อมูลอำเภอและตำบล
│   │
│   ├── lib/
│   │   ├── aggregation/
│   │   │   ├── nationwide.ts               # รวมข้อมูลจากทุก provider (orchestrator)
│   │   │   └── province-status.ts          # คำนวณสถานะรายจังหวัด
│   │   ├── cache/
│   │   │   └── server-cache.ts             # Server-side cache with TTL
│   │   └── providers/                      # === Data Providers ===
│   │       ├── bma.ts                      # BMA DDS 254 เซนเซอร์ (กทม.)
│   │       ├── gistda.ts                   # GISTDA ขอบเขตน้ำท่วมดาวเทียม
│   │       ├── highway.ts                  # กรมทางหลวง จุดเตือนน้ำท่วมถนน
│   │       ├── openmeteo.ts                # Open-Meteo พยากรณ์อากาศ
│   │       ├── rainviewer.ts               # RainViewer เรดาร์ตรวจฝน
│   │       ├── rid.ts                      # กรมชลประทาน ข้อมูลเขื่อน
│   │       ├── shelter.ts                  # ปภ. ศูนย์พักพิง
│   │       ├── thaiwater.ts                # ThaiWater ระดับน้ำ + ฝน
│   │       ├── tide.ts                     # กองทัพเรือ น้ำทะเลหนุน
│   │       ├── tmd.ts                      # กรมอุตุฯ เตือนภัย
│   │       └── types.ts                    # DataResult, DataStatus types
│   │
│   └── types/
│       ├── telemetry.ts                    # TelemetryStation, Dam, Alert types
│       ├── weather.ts                      # Weather forecast types
│       └── index.ts                        # TypeScript interfaces
│
├── public/                                 # Static assets
├── .env.example                            # Environment variables template
├── tailwind.config.ts                      # Tailwind CSS configuration
├── tsconfig.json                           # TypeScript configuration
└── package.json                            # Dependencies & scripts
```

---

### 🚀 การติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. โคลนคลังโค้ด
git clone https://github.com/Noobmaster-3443/Prachinburi-Flood-Tracker.git
cd Prachinburi-Flood-Tracker

# 2. ติดตั้ง Dependencies
npm install

# 3. รันโหมด Development
npm run dev
```

เปิดดูในเบราว์เซอร์:
- หน้าเว็บหลัก: `http://localhost:3000`
- หน้าสรุปรายพื้นที่: `http://localhost:3000/area`

### 🔧 Environment Variables

```bash
# ไม่จำเป็นต้องตั้งค่า API Key ใดๆ — ทุก provider ใช้ Open Data API
# สามารถเพิ่ม optional settings ได้:
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

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

**Thailand Flood Tracker** aggregates live telemetry data from 11+ official Thai government agencies into a single interactive map dashboard. It provides:

- **254 BMA road-flood sensors** across Bangkok with real-time water depth (cm) and vehicle passability status
- **Nationwide river gauges** from ThaiWater/HII covering all major basins
- **Dam & reservoir monitoring** via the Royal Irrigation Department (RID)
- **Highway flood alerts** from the Department of Highways (DOH)
- **Satellite flood extent** from GISTDA radar imagery
- **Weather radar** (RainViewer + BMA/TMD Nong Chok station)
- **7-day weather forecasts** from Open-Meteo/ECMWF
- **Tidal surge warnings** from the Royal Thai Navy
- **Evacuation shelters** from DDPM with capacity and hotline info
- **Province-level status** (NORMAL → WATCH → WARNING → FLOODING → CRITICAL) computed from real evidence

### Key Features

1. **Interactive Map** — Leaflet-based with 10+ toggleable layers (stations, dams, shelters, highways, radar, wind, clouds, GISTDA flood extent)
2. **Bangkok Focus** — 254 BMA DDS road-flood sensors with depth readings, passability, and dedicated radar modal
3. **Nationwide Coverage** — All 77 provinces with computed flood status, searchable by name
4. **Detail Drawer** — Professional-grade analysis panel for each station/dam/shelter/highway alert
5. **Weather Forecast** — 7-day precipitation probability, rainfall, and temperature
6. **Emergency Hotlines** — One-tap dial to DDPM (1784), EMS (1669), and DOH (1586)
7. **Resilient Data Pipeline** — `Promise.allSettled` with per-provider failure isolation and server-side caching

### Data Flow

```
ThaiWater ──┐
RID Dams ───┤
BMA DDS ────┤
TMD ────────┤ Promise.allSettled()    Server-side     SSR Page
GISTDA ─────┼─────────────────────→ getWithCache() → page.tsx → Client
DOH ────────┤                        (TTL per provider)
Navy Tide ──┤
Shelters ───┤
Open-Meteo ─┤
RainViewer ─┘
```

---

### 🌐 Data Sources & Acknowledgements

| Agency | Thai Name | Data |
|--------|----------|------|
| HII / ThaiWater | สถาบันสารสนเทศทรัพยากรน้ำ | River gauges, rainfall |
| RID | กรมชลประทาน | Dams, reservoirs, irrigation canals |
| BMA DDS | สำนักการระบายน้ำ กทม. | 254 road-flood sensors, Bangkok radar |
| TMD | กรมอุตุนิยมวิทยา | Weather warnings, radar |
| GISTDA | สทอภ. | Satellite flood extent |
| DOH | กรมทางหลวง | Highway flood alerts |
| Royal Thai Navy | กรมอุทกศาสตร์ กองทัพเรือ | Tidal surge predictions |
| DDPM | กรมป้องกันและบรรเทาสาธารณภัย | Evacuation shelters |
| Open-Meteo | — | Weather forecasts (ECMWF) |
| RainViewer | — | Live weather radar composites |
| NASA GIBS | — | Satellite cloud imagery |

---

## 🤖 เครดิตการพัฒนา / Credits

- **พัฒนาและออกแบบร่วมกับ:** **Google Gemini** (Gemini AI Models by **Google DeepMind**)
- **สัญญาอนุญาต:** เผยแพร่ภายใต้ **MIT License** เพื่อสาธารณประโยชน์และการกู้ภัยพิบัติ

---

### 🙏 ข้อความจากผู้จัดทำ / Disclaimer

> **🇹🇭 หมายเหตุ:** โครงการนี้จัดทำขึ้นด้วยความตั้งใจเพื่อเป็นประโยชน์ต่อพี่น้องประชาชนชาวไทยและผู้ประสบภัยพิบัติ ข้อมูลที่แสดงผลเป็นข้อมูลจากหน่วยงานราชการที่เปิดเผยต่อสาธารณะ หากมีข้อผิดพลาดหรือข้อบกพร่องประการใด คณะผู้จัดทำต้องขออภัยมา ณ ที่นี้ด้วยครับ ท่านสามารถร่วมแจ้งปัญหาหรือเสนอแนะการปรับปรุงเพิ่มเติมผ่านทาง GitHub Issues ได้ตลอดเวลาครับ
>
> **🇬🇧 Disclaimer:** This project was built with the intention to help Thai citizens and disaster relief efforts. All data is sourced from publicly available government open data APIs. If there are any errors or inaccuracies, we sincerely apologize. Feedback and contributions are always welcome via GitHub Issues.
