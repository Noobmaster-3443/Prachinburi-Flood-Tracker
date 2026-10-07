# 🌊 PrachinFlood (ศูนย์ข้อมูลน้ำท่าและเตือนภัยน้ำท่วมปราจีนบุรี - Open Data Dashboard)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)
![Open Data](https://img.shields.io/badge/Open%20Data-HII%20%7C%20RID%20%7C%20GISTDA%20%7C%20DOH%20%7C%20DDPM-blue?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Built with Google Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-8E75C4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)

**ระบบติดตามสถานการณ์น้ำท่า โทรมาตรเตือนภัย และวิเคราะห์ความเสี่ยงอุทกภัยแบบรวมศูนย์ จังหวัดปราจีนบุรี**  
*Prachinburi Real-Time Multi-Hazard & Water Telemetry Open Data Dashboard*

**[🇹🇭 ภาษาไทย](#-ภาษาไทย-thai-version) • [🇬🇧 English](#-english-version) • [🤖 เครดิตการพัฒนา](#-เครดิตการพัฒนา--credits)**

</div>

---

## 🇹🇭 ภาษาไทย (Thai Version)

### 📖 เกี่ยวกับโครงการ (About the Project)
> **"ศูนย์รวมข้อมูลน้ำท่าโทรมาตร ข้อมูลเขื่อน น้ำทะเลหนุน น้ำป่าไหลหลาก และเตือนภัยเส้นทางคมนาคมจังหวัดปราจีนบุรีแบบอัตโนมัติ (Automated Multi-Hazard Open Data Dashboard)"**

จังหวัดปราจีนบุรีเป็นพื้นที่ลุ่มน้ำสำคัญในภาคตะวันออกที่รองรับมวลน้ำจากทางตอนเหนือ เทือกเขาใหญ่ และอุทยานแห่งชาติทับลาน โดยมีแม่น้ำปราจีนบุรี แควหนุมาน และแควพระปรงไหลมาบรรจบกัน ปัญหาอุทกภัยในพื้นที่เกิดจากปัจจัยร่วมหลายด้าน ทั้งน้ำหลากจากยอดเขา ปริมาณน้ำกักเก็บในเขื่อนหลักที่ต้องระบายออก ปริมาณน้ำฝนสะสม และปรากฏการณ์น้ำทะเลหนุนสูงในแม่น้ำบางปะกงที่ดันย้อนเข้าสู่แม่น้ำปราจีนบุรี ทำให้การระบายน้ำล่าช้าและส่งผลกระทบเป็นวงกว้าง (โดยเฉพาะ อ.กบินทร์บุรี, อ.บ้านสร้าง, อ.ศรีมหาโพธิ, อ.เมืองปราจีนบุรี และ อ.นาดี)

**PrachinFlood** ได้รับการพัฒนาให้เป็นระบบติดตามสถานการณ์น้ำแบบรวมศูนย์ (Multi-Hazard Disaster Intelligence) รวบรวมและประมวลผลข้อมูลจากหน่วยงานภาครัฐและสถาบันวิจัยชั้นนำ เพื่อให้ประชาชนและเจ้าหน้าที่สามารถประเมินสถานการณ์ได้อย่างแม่นยำและทันท่วงที:
1. **สถานีโทรมาตรวัดน้ำท่า (HII / ThaiWater & RID):** ตรวจวัดระดับน้ำเทียบตลิ่ง (ม.รทก.), ร้อยละความจุลำน้ำ (% Bank Capacity) และปริมาณฝนสะสม 24 ชม.
2. **ข้อมูลเขื่อนและอ่างเก็บน้ำหลัก (RID Dams & Reservoirs):** ติดตามปริมาณน้ำกักเก็บและอัตราการระบายน้ำของเขื่อนนฤบดินทรจินดา (ห้วยโสมง), เขื่อนขุนด่านปราการชล และเขื่อนคลองสียัด
3. **แจ้งเตือนน้ำทะเลหนุนสูง (Hydrographic Department, Royal Thai Navy):** ข้อมูลระดับน้ำทะเลหนุนสูงสุดประจำวันและช่วงเวลาเฝ้าระวังน้ำดันย้อนตลิ่งในพื้นที่ อ.บ้านสร้าง และ อ.เมืองปราจีนบุรี
4. **เตือนภัยน้ำป่าไหลหลากล่วงหน้า (Flash Flood Early Warning):** ตรวจจับปริมาณฝนสะสมบนเทือกเขาใหญ่และทับลาน พร้อมคำนวณระยะเวลาคาดการณ์ก่อนมวลน้ำหลากเข้าท่วมชุมชน
5. **ศูนย์พักพิงและจุดอพยพชั่วคราว (DDPM Evacuation Shelters):** แสดงจุดปลอดภัย ความจุที่รองรับได้ จำนวนผู้พักพิงปัจจุบัน และเบอร์ติดต่อผู้ประสานงาน
6. **จุดเตือนน้ำท่วมทางหลวง (DOH Open Data):** ข้อมูลเส้นทางสัญจร จุดน้ำท่วมผิวจราจร (เช่น ทล.304, ทล.319) สถานะรถผ่านได้/ไม่ได้ และคำแนะนำเส้นทางเลี่ยง
7. **พื้นที่น้ำท่วมจากภาพถ่ายดาวเทียม (GISTDA Flood Extent):** แสดงแนวขอบเขตพื้นที่น้ำท่วมขังจริงจากดาวเทียมเรดาร์
8. **เรดาร์กลุ่มฝนสด TMD พร้อมแอนิเมชัน (Rain Radar Player):** แถบควบคุมเล่นภาพย้อนหลัง 2 ชั่วโมง พร้อม Timeline Scrubber
9. **พยากรณ์อากาศล่วงหน้า 7 วัน & 24 ชม. (Open-Meteo / ECMWF):** คาดการณ์โอกาสเกิดฝนตก (%) ปริมาณฝน (มม.) และอุณหภูมิเจาะลึก 7 อำเภอ
10. **กระแสลมมรสุมและกลุ่มเมฆดาวเทียม (Wind Flow & Satellite Clouds):** เวกเตอร์ทิศทางลมมรสุมตะวันตกเฉียงใต้ และภาพถ่ายดาวเทียมกลุ่มเมฆ NASA GIBS

---

### ✨ ฟีเจอร์หลัก (Key Features)

#### 1. 🗺️ แผนที่โทรมาตรเชิงโต้ตอบไร้รอยต่อ (Interactive Telemetry Map)
* ออกแบบหน้าจอตามหลัก Clean UX ให้แผนที่เป็นจุดสนใจหลัก (Zero UI Clutter) ปราศจากกล่องข้อความบดบัง
* สลับดูแผนที่ถนนความคมชัดสูง (OpenStreetMap) หรือภาพถ่ายดาวเทียมความละเอียดสูง (Esri World Imagery) ได้ในคลิกเดียว
* ระบบจัดการเลเยอร์ข้อมูล (Layer Switcher) ที่สามารถเปิด-ปิดได้ตามต้องการ:
  * 🏞️ เขื่อนและอ่างเก็บน้ำหลัก (Dams & Reservoirs)
  * ⛰️ จุดเตือนภัยน้ำป่าไหลหลาก (Flash Flood Alerts)
  * ⛺ ศูนย์พักพิงชั่วคราว ปภ. (Evacuation Shelters)
  * 🚧 จุดเตือนน้ำท่วมทางหลวง (Highway Flood Alerts)
  * 🌧️ เรดาร์กลุ่มฝนสด TMD (Live Weather Radar) พร้อมแอนิเมชัน Timeline Scrubber
  * 💨 กระแสลมมรสุมและทิศทางลม (Wind Flow Vectors)
  * ☁️ ภาพถ่ายดาวเทียมกลุ่มเมฆสด (NASA GIBS Cloud Cover)
  * 🛰️ พื้นที่น้ำท่วมจากดาวเทียม GISTDA (ปรับ Opacity ได้)
  * 🌐 เส้นขอบเขตการปกครอง 7 อำเภอ

#### 2. 📋 มุมมองรายการสถานีและสรุปสถานการณ์ (Categorized Feed List)
* สลับมุมมองระหว่าง **"แผนที่"** และ **"รายการ"** ได้อย่างรวดเร็วผ่านปุ่มแถบนำทางด้านบน
* สรุปตัวเลขสถิติภาพรวมสำคัญ 4 มิติ: สถานีวิกฤต, สถานีเฝ้าระวัง, เส้นทางที่ไม่สามารถสัญจรได้ และสถานะความจุเขื่อนหลัก
* บัตรข้อมูลแยกตามหมวดหมู่อย่างเป็นระเบียบ พร้อมปุ่ม **"เปิดดูในแผนที่"** ที่จะแพนกล้องไปยังพิกัดเป้าหมายทันที

#### 3. 🔍 แถบค้นหาและตัวกรองข้อมูลแบบลอยตัว (Floating Filter Bar)
* ค้นหาสถานี, ลำคลอง หรือรหัสสถานี (เช่น Kgt.3, HII-PC03) ได้ทันที
* กรองข้อมูลเจาะจงรายอำเภอทั้ง 7 อำเภอในจังหวัดปราจีนบุรี
* กรองตามระดับความรุนแรงของสถานการณ์น้ำ (ปกติ, เฝ้าระวัง, เตือนภัย, วิกฤต/ล้นตลิ่ง)
* รองรับระบบ **Auto-refresh** ดึงข้อมูลอัปเดตอัตโนมัติทุก 60 วินาที พร้อมปุ่มกดรีเฟรชด้วยตนเอง

#### 4. 📊 หน้าต่างวิเคราะห์รายละเอียดเชิงลึก (Hazard Detail Drawer)
* เมื่อกดที่หมุดหรือบัตรข้อมูล หน้าต่างลิ้นชักด้านล่างจะเลื่อนขึ้นมาแสดงผลการวิเคราะห์ระดับมืออาชีพ:
  * **สถานีวัดน้ำ:** ระดับน้ำปัจจุบันเทียบระดับตลิ่ง, ร้อยละความจุลำน้ำ, กราฟสเกลจำลองระดับน้ำ และปริมาณฝนสะสม
  * **เขื่อน/อ่างเก็บน้ำ:** ร้อยละความจุอ่าง, อัตราน้ำไหลเข้า-ออก (ลบ.ม./วินาที) และการแจ้งเตือนท้ายเขื่อน
  * **น้ำทะเลหนุน:** ตารางเปรียบเทียบระดับน้ำขึ้นสูงสุดรอบเช้าและรอบเย็น (ม.รทก.)
  * **น้ำป่าไหลหลาก:** ปริมาณฝนบนยอดเขา ระยะเวลาคาดการณ์น้ำหลาก (ชั่วโมง) และข้อควรระวัง
  * **ศูนย์พักพิง:** จำนวนรองรับ, สถานะความพร้อม (โรงครัว/ทีมแพทย์/ที่จอดรถ) และปุ่มโทรประสานงาน

#### 5. 📞 สายด่วนฉุกเฉินและขอความช่วยเหลือ 24 ชั่วโมง (Emergency Hotline)
* ปุ่มโทรฉุกเฉินเด่นชัดในแถบนำทาง พร้อมไฟกระพริบเตือน
* โทรออกได้ใน 1 สัมผัส:
  * **1784:** สายด่วน ปภ. (กรมป้องกันและบรรเทาสาธารณภัย) รับแจ้งเหตุน้ำท่วมและขอเรืออพยพ
  * **1669:** สถาบันการแพทย์ฉุกเฉินแห่งชาติ (EMS) เจ็บป่วยฉุกเฉินและอุบัติเหตุทางน้ำ
  * **1586:** สายด่วนกรมทางหลวง สอบถามเส้นทางและเหตุดินสไลด์/น้ำท่วมทาง

#### 6. 📍 หน้าเจาะลึก 7 อำเภอ (Area Breakdown - `/area`)
* วิเคราะห์สถานการณ์น้ำเฉพาะพื้นที่รายอำเภอ (ครอบคลุมทั้ง 7 อำเภอของปราจีนบุรี)
* ปุ่ม **"ใกล้ฉัน"** ใช้พิกัด GPS เพื่อสลับไปยังอำเภอที่ผู้ใช้อยู่โดยอัตโนมัติ
* สรุปสถานการณ์ของแต่ละอำเภอ พร้อมจุดเตือนเส้นทางคมนาคมในเขตพื้นที่

---

## 🇬🇧 English Version

### 📖 About the Project
> **"Automated Multi-Hazard Telemetry & Flood Intelligence Platform for Prachinburi Province"**

Prachinburi Province represents a major hydrologic basin in eastern Thailand, receiving water runoff from Khao Yai and Thap Lan national parks via the Prachinburi, Hanuman, and Phra Prong river systems. Recurring floods are driven by multi-faceted factors: upstream mountain flash floods, reservoir discharges, prolonged basin-wide precipitation, and high tidal surges pushing up through the Bang Pakong river.

**PrachinFlood** delivers a unified, real-time disaster intelligence dashboard that integrates verified open data from leading government and scientific authorities:
1. **River Telemetry Gauges (HII & RID):** Real-time monitoring of river stage above mean sea level (m.MSL), % riverbank capacity, and 24-hour rainfall.
2. **Major Dams & Reservoirs (RID):** Live tracking of storage volume, reservoir capacity percentages, inflow, and outflow rates for Narubodin Jinda (Huai Samong), Khun Dan Prakarnchon, and Klong Si Yat dams.
3. **Marine High Tide Surge Warnings (Royal Thai Navy Hydrographic Dept):** Twice-daily astronomical high tide predictions and river backflow risk alerts for Ban Sang and Mueang Prachinburi districts.
4. **Flash Flood Early Warnings:** Monitored mountain precipitation and estimated travel-time to residential lowlands.
5. **DDPM Evacuation Shelters:** Emergency evacuation site directory, capacity statuses, onboard relief amenities, and direct hotline dials.
6. **Highway Disaster Alerts (Department of Highways):** Flood-affected roadway tracking (e.g. Route 304, Route 319) with small-vehicle passability status and detour advisories.
7. **Satellite Flood Inundation (GISTDA):** Radar satellite-derived flood extent polygons with adjustable layer opacity.
8. **Live TMD Rain Radar:** Interactive weather radar composite with automatic zoom upscaling.

---

### 🛠️ โครงสร้างไฟล์และสถาปัตยกรรม (Project Structure)

```text
PrachinBuri-flood/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx                 # แผงควบคุมระบบตรวจสอบของผู้ดูแล
│   │   ├── area/
│   │   │   └── page.tsx                 # หน้าสรุปสถานการณ์น้ำเจาะลึก 7 อำเภอ
│   │   ├── globals.css                  # สไตล์ Tailwind CSS และ Leaflet Pin Animations
│   │   ├── layout.tsx                   # โครงสร้างหน้าเว็บพร้อมฟอนต์ IBM Plex Sans Thai
│   │   └── page.tsx                     # หน้าหลัก (Map View / Categorized Feed List)
│   ├── components/
│   │   ├── Dashboard/
│   │   │   └── MetricBanner.tsx         # การ์ดสรุปสถิติ 4 มิติและแถบน้ำทะเลหนุน/น้ำป่า
│   │   ├── Emergency/
│   │   │   └── EmergencyDrawer.tsx      # หน้าต่างสายด่วนฉุกเฉิน 1784 / 1669 / 1586
│   │   ├── Feed/
│   │   │   └── TelemetryStationFeedList.tsx # ฟีดแสดงรายการสถานี เขื่อน ศูนย์พักพิง และจุดเตือนภัย
│   │   ├── Filters/
│   │   │   └── TelemetryFilterBar.tsx   # แถบค้นหาและตัวกรองอำเภอ/ระดับน้ำแบบลอยตัว
│   │   ├── Map/
│   │   │   ├── DynamicTelemetryMap.tsx  # Dynamic SSR Loader สำหรับแผนที่ Leaflet
│   │   │   └── TelemetryMap.tsx         # แผนที่หลักพร้อมระบบสลับชั้นข้อมูล 7 รูปแบบ
│   │   ├── Navbar/
│   │   │   └── TelemetryNavbar.tsx      # แถบนำทางด้านบน ปุ่มสลับมุมมอง และปุ่มสายด่วน
│   │   └── ReportDrawer/
│   │       └── TelemetryDetailDrawer.tsx # ลิ้นชักแสดงรายละเอียดเชิงวิเคราะห์ของแต่ละภัยพิบัติ
│   ├── data/
│   │   ├── open-data-telemetry.ts       # ชุดข้อมูลสถานีโทรมาตร เขื่อน ศูนย์พักพิง และน้ำหนุน
│   │   ├── prachinburi-districts.json   # GeoJSON เส้นขอบเขตการปกครอง 7 อำเภอ
│   │   └── prachinburi-locations.ts     # รายชื่ออำเภอและตำบลในจังหวัดปราจีนบุรี
│   ├── lib/
│   │   ├── telemetry-service.ts         # เซอร์วิสประมวลผลข้อมูลโทรมาตรและคำนวณความเสี่ยง
│   │   ├── contacts-store.ts            # การจัดการรายชื่อเบอร์โทรฉุกเฉิน
│   │   └── supabase.ts                  # ไคลเอนต์ Supabase สำหรับจัดเก็บข้อมูลบนคลาวด์
│   └── types/
│       ├── telemetry.ts                 # โครงสร้างประเภทข้อมูล (Data Models) ครบวงจร
│       └── index.ts                     # TypeScript Interfaces
├── public/                              # ไฟล์ภาพและ Static Assets
├── .env.example                         # ตัวอย่างการตั้งค่า Environment Variables
├── tailwind.config.ts                   # การตั้งค่าชุดสีและสไตล์ Tailwind CSS
├── tsconfig.json                        # การตั้งค่า TypeScript
└── package.json                         # ข้อมูลแพ็กเกจและ Dependencies
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
* หน้าเว็บหลัก: `http://localhost:3000`
* หน้าเจาะลึกรายอำเภอ: `http://localhost:3000/area`
* หน้าแอดมิน: `http://localhost:3000/admin` *(รหัสผ่านเริ่มต้น: `admin8888`)*

---

### 🌐 แหล่งข้อมูลเปิดที่เชื่อมต่อ (Data Sources & Acknowledgements)

ระบบเชื่อมต่อและอ้างอิงข้อมูลจากหน่วยงานหลักด้านทรัพยากรน้ำและภัยพิบัติของประเทศไทย:
* **HII (สถาบันสารสนเทศทรัพยากรน้ำ - องค์การมหาชน):** ข้อมูลโทรมาตรวัดระดับน้ำท่าและฝนสะสม (คลังข้อมูลน้ำแห่งชาติ ThaiWater)
* **RID (กรมชลประทาน):** ข้อมูลระดับน้ำในทางน้ำชลประทาน และข้อมูลปริมาณน้ำกักเก็บในเขื่อนและอ่างเก็บน้ำหลัก
* **Hydrographic Department (กรมอุทกศาสตร์ กองทัพเรือ):** ข้อมูลระดับน้ำขึ้น-น้ำลง และการคาดการณ์น้ำทะเลหนุนสูง
* **DDPM (กรมป้องกันและบรรเทาสาธารณภัย):** ระบบเตือนภัยล่วงหน้าน้ำป่าไหลหลาก และฐานข้อมูลศูนย์พักพิงชั่วคราว
* **DOH (กรมทางหลวง):** ข้อมูลสถานการณ์น้ำท่วมผิวจราจรบนทางหลวงแผ่นดิน
* **GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ):** แผนที่ขอบเขตพื้นที่น้ำท่วมจากภาพถ่ายดาวเทียมเรดาร์
* **RainViewer & TMD:** ข้อมูลเรดาร์ตรวจวัดกลุ่มฝนสดแบบกระจายเชิงพื้นที่

---

## 🤖 เครดิตการพัฒนา / Credits

* **พัฒนาและออกแบบร่วมกับ (Co-developed with):** **Google Gemini** (Gemini AI Models by **Google DeepMind**)
* **สัญญาอนุญาต (License):** เผยแพร่ภายใต้สัญญาอนุญาต **MIT License** เพื่อสาธารณประโยชน์และการกู้ภัยพิบัติของประชาชน

---

### 🙏 ข้อความจากผู้จัดทำ / Disclaimer

> **🇹🇭 หมายเหตุ:** โครงการนี้จัดทำขึ้นด้วยความตั้งใจเพื่อเป็นประโยชน์ต่อพี่น้องประชาชนชาวปราจีนบุรีและผู้ประสบภัยพิบัติ หากมีข้อผิดพลาด ข้อมูลคลาดเคลื่อน หรือข้อบกพร่องประการใด คณะผู้จัดทำต้องกราบขออภัยมา ณ ที่นี้ด้วยครับ ท่านสามารถร่วมแจ้งปัญหาหรือเสนอแนะการปรับปรุงเพิ่มเติมผ่านทาง GitHub Issues ได้ตลอดเวลาครับ  
>  
> **🇬🇧 Disclaimer:** This project was created with good intentions to assist the residents of Prachinburi Province and disaster relief efforts. If there are any unintentional errors or inaccuracies, we sincerely apologize. Feedback and suggestions are always warmly welcomed via GitHub Issues.
