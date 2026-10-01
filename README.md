# 🌊 PrachinFlood (ระบบรายงานสถานการณ์น้ำท่วมจังหวัดปราจีนบุรี)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-8E75C4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)

**Prachinburi Flood Tracker • แพลตฟอร์มรายงานสถานการณ์น้ำท่วมชุมชนจังหวัดปราจีนบุรี**

**[ภาษาไทย](#-ภาษาไทย-thai-version) • [English](#-english-version) • [เครดิต AI / Credits](#-เครดิตการพัฒนา--credits)**

</div>

---

## 🇹🇭 ภาษาไทย (Thai Version)

### 📖 เกี่ยวกับโครงการ (About the Project)
> **"รวมพลังชุมชนคนปราจีนบุรี รู้ทันระดับน้ำ ปลอดภัยทุกเส้นทาง"**

จังหวัดปราจีนบุรีเป็นพื้นที่ลุ่มน้ำสำคัญที่รองรับมวลน้ำจากทางตอนเหนือ เทือกเขาใหญ่ และอุทยานแห่งชาติทับลาน โดยมีแม่น้ำปราจีนบุรี แควหนุมาน และแควพระปรงไหลผ่าน ซึ่งในสถานการณ์ปัจจุบัน ปัญหาอุทกภัยเกิดจากฝนที่ตกชุกสะสมติดต่อกันหลายวันในพื้นที่ตอนเหนือ ส่งผลให้มีมวลน้ำเหนือก้อนใหญ่ไหลหลากลงมาสมทบอย่างต่อเนื่อง จนเอ่อล้นตลิ่งเข้าท่วมบ้านเรือนและเส้นทางสัญจรในหลายอำเภอ (โดยเฉพาะอำเภอกบินทร์บุรี, อำเภอบ้านสร้าง, อำเภอศรีมหาโพธิ ฯลฯ)

**PrachinFlood** ถูกพัฒนาขึ้นเป็นระบบบริการสาธารณะเพื่อชุมชน (Civic Tech Open-Source) มุ่งเน้นการมีส่วนร่วมของประชาชน (Community Crowdsourcing) ให้ชาวบ้าน จิตอาสา และหน่วยงานกู้ภัยในพื้นที่สามารถ:
1. **แจ้งข้อมูลระดับน้ำจริงหน้างาน:** ถ่ายรูปและปักหมุดจุดน้ำท่วมได้ทันที โดยไม่ต้องลงทะเบียน
2. **ประหยัดอินเทอร์เน็ต:** มีระบบย่อรูปภาพในเครื่อง (Canvas Compression) ช่วยให้ส่งข้อมูลได้แม้อยู่ในจุดอับสัญญาณ
3. **ตรวจสอบเส้นทางสัญจร:** เช็กได้ทันทีว่าจุดไหนรถเล็กผ่านได้ หรือจุดไหนรถเล็กผ่านไม่ได้
4. **ประสานงานฉุกเฉิน:** ต่อสายตรงถึงสายด่วนกู้ภัย 1784 และ 1669 ได้ในคลิกเดียว พร้อมระบบเสนอเบอร์ช่วยเหลือในตำบล
5. **ปลอดภัยจากสแปม:** มีระบบควบคุมหลังบ้าน (Admin Moderation) คอยคัดกรองและลบข้อมูลก่อกวน

---

### ✨ ฟีเจอร์หลัก (Key Features)

1. **🗺️ แผนที่เชิงโต้ตอบไร้ลายน้ำ (Interactive Leaflet Map):**
   * แสดงหมุดสถานะน้ำท่วม 4 ระดับสี พร้อมเอฟเฟกต์วงแหวนเรดาร์กะพริบ (Radar Pulse):
     * 🟢 **เขียว:** เฝ้าระวัง / น้ำแห้งแล้ว / สัญจรปกติ
     * 🟡 **เหลือง:** น้ำท่วมขังเล็กน้อย รถเล็กผ่านได้
     * 🟠 **ส้ม:** น้ำท่วมสูง รถเล็กผ่านไม่ได้
     * 🔴 **แดง:** วิกฤต / ต้องการความช่วยเหลือด่วน
   * ใช้แผนที่ **Official OpenStreetMap** (ฟรี 100% ไร้ลายน้ำ ไม่ต้องใช้ API Key)
   * สลับดู **ภาพถ่ายดาวเทียมความละเอียดสูง (Esri World Imagery)** ได้ใน 1 แตะ

2. **📐 เส้นขอบเขต 7 อำเภอ พร้อมปุ่มเปิด-ปิด (District Boundaries & Toggle):**
   * ตีเส้นขอบเขตการปกครองชัดเจนครอบคลุมทั้ง 7 อำเภอ (อ.เมือง, กบินทร์บุรี, บ้านสร้าง, ศรีมหาโพธิ, นาดี, ประจันตคาม, ศรีมโหสถ)
   * ป้ายชื่ออำเภอแบบเข็มกลัดลอย (Badges) ระบุพื้นที่ชัดเจน
   * **ปุ่มเปิด-ปิดขอบเขต:** สามารถแตะเปิดหรือปิดเส้นขอบเขตได้ในคลิกเดียว สำหรับผู้ที่ต้องการดูแผนที่แบบโล่งๆ

3. **📱 ฟอร์มแจ้งสถานการณ์น้ำและระบบย่อรูปภาพ (Crowdsourced Reporting):**
   * ปุ่มลอยแจ้งเหตุด่วน (Floating Action Button) เด่นชัดสำหรับมือถือ
   * ดึงพิกัด GPS อัตโนมัติ พร้อมตัวเลือกอำเภอและตำบลในปราจีนบุรี
   * **Client-Side Image Compression:** ย่อขนาดรูปถ่ายหน้างานจากกล้องมือถือ (5–15 MB) ให้เหลือเพียง ~80–150 KB ในเสี้ยววินาที รองรับการส่งในจุดอับสัญญาณ

4. **📞 สายด่วนฉุกเฉิน & ระบบเสนอเบอร์โทร:**
   * เบอร์หลักโทรออกได้ทันทีใน 1 แตะ: **1784** (สายด่วน ปภ. ช่วยเหลือน้ำท่วม 24 ชม.) และ **1669** (การแพทย์ฉุกเฉิน EMS)
   * ประชาชนสามารถกด **"เสนอเพิ่มเบอร์กู้ภัยในพื้นที่"** ได้ โดยข้อมูลจะต้องผ่านการตรวจสอบและอนุมัติจากแอดมินก่อนขึ้นระบบจริง

5. **🛡️ ระบบควบคุมหลังบ้าน (Admin Moderation Dashboard):**
   * เข้าใช้งานที่ `/admin` พร้อมระบบล็อกอินด้วย Admin Passcode
   * ตรวจสอบและกดลบรายงานก่อกวน/ข้อมูลเท็จได้ทันที
   * กดรับรองรายงาน (Verify Badge ✓) เพื่อยืนยันว่าเจ้าหน้าที่ตรวจสอบแล้ว
   * กดอนุมัติหรือปฏิเสธเบอร์โทรฉุกเฉินที่ประชาชนเสนอเข้ามา

---

### 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รันโหมด Development (ผูกกับ 0.0.0.0 เพื่อให้มือถือในวง Wi-Fi เข้าทดสอบได้)
npm run dev
```

เปิดดูในเบราว์เซอร์:
* หน้าเว็บหลัก: `http://localhost:3000`
* หน้าแอดมิน: `http://localhost:3000/admin` *(รหัสผ่านเริ่มต้น: `admin8888`)*

---

## 🇬🇧 English Version

### 📖 About the Project
> **"Empowering the Prachinburi community with real-time, citizen-driven flood intelligence."**

Prachinburi Province serves as a critical downstream drainage basin in eastern Thailand, receiving water flows from the northern regions, Khao Yai, and Thap Lan national parks via the Prachinburi, Hanuman, and Phra Prong rivers. Under current conditions, persistent and heavy rainfall over multiple consecutive days in upstream northern areas has generated an immense volume of runoff, resulting in severe river overflows and widespread flooding across low-lying districts such as Kabin Buri, Ban Sang, and Si Maha Phot.

**PrachinFlood (Prachinburi Flood Tracker)** was developed as an open-source civic technology platform to bridge the gap between affected citizens, volunteers, and rescue agencies:
1. **Real-Time Citizen Reporting:** Upload photos and mark flood hotspots without requiring registration.
2. **Bandwidth-Optimized:** Compresses smartphone images in the browser before transmission, ensuring reliable delivery even under weak network signals.
3. **Route Navigation Safety:** Quickly verify road conditions (passable for small cars vs. impassable).
4. **Emergency Lifeline:** One-tap dialing to disaster hotlines (1784 & 1669) plus community-suggested rescue contacts.
5. **Quality Assurance:** Backoffice admin moderation to prevent spam, rumors, and troll submissions.

---

### ✨ Key Features

1. **🗺️ Interactive Map (Leaflet.js):**
   * Color-coded flood severity markers with animated radar pulse rings (Green, Yellow, Orange, Red).
   * Powered by **Official OpenStreetMap** (100% Free, Zero API keys, No watermarks).
   * Instant toggle to **High-Resolution Satellite Imagery (Esri World Imagery)**.

2. **📐 Prachinburi District Boundaries with 1-Tap Toggle:**
   * Official polygon boundaries covering all 7 districts of Prachinburi Province.
   * Floating center badges with district names.
   * **1-Tap Boundary Toggle:** Turn administrative boundaries on/off anytime.

3. **📱 Crowdsourced Reporting & Client-Side Compression:**
   * Prominent mobile Floating Action Button (FAB).
   * Geolocation auto-fill with draggable coordinate placement.
   * Dropdowns for Prachinburi districts and subdistricts.
   * **Client-Side Image Compression:** Compresses 5–15 MB smartphone photos down to ~80–150 KB in milliseconds using HTML5 Canvas.

4. **📞 Emergency Hotlines & Community Number Suggestions:**
   * One-tap direct dial for primary hotlines: **1784** (DDPM Disaster Hotline) and **1669** (Emergency Medical Services).
   * Citizen hotline submission form: Community members can submit local rescue contacts, which remain pending until admin approval.

5. **🛡️ Admin Moderation Dashboard (`/admin`):**
   * Passcode protected backoffice.
   * Remove spam, trolling, or inaccurate flood reports immediately.
   * Verify genuine reports with official verification badges.
   * Approve or reject citizen-submitted emergency contacts.

---

### 🛠️ Project Structure

```text
PrachinBuri-flood/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx             # Admin Moderation Dashboard
│   │   ├── globals.css              # Custom markers, Leaflet styles, Tailwind CSS
│   │   ├── layout.tsx               # Root layout with IBM Plex Sans Thai font
│   │   └── page.tsx                 # Main application page (Map & Feed)
│   ├── components/
│   │   ├── Emergency/
│   │   │   └── EmergencyDrawer.tsx  # Emergency hotline modal & suggestion form
│   │   ├── Feed/
│   │   │   └── ReportFeedList.tsx   # Card feed view for mobile / low data
│   │   ├── Filters/
│   │   │   └── FilterBar.tsx        # District, severity, and text search filter
│   │   ├── Map/
│   │   │   ├── DynamicMap.tsx       # Dynamic Client Loader preventing SSR issues
│   │   │   └── FloodMap.tsx         # Leaflet map with boundaries & radar markers
│   │   ├── Navbar.tsx               # Header with live summary & view toggler
│   │   ├── ReportDrawer/
│   │   │   └── ReportDetailDrawer.tsx # Report detail bottom sheet & directions
│   │   └── ReportModal/
│   │       ├── FloatingActionButton.tsx # Mobile floating report button (FAB)
│   │       └── ReportFormModal.tsx  # Flood reporting form with image compression
│   ├── data/
│   │   ├── emergency-contacts.ts    # Default hotlines (1784, 1669)
│   │   ├── mock-reports.ts          # Clean production data store
│   │   ├── prachinburi-districts.json # GeoJSON boundaries for 7 districts
│   │   └── prachinburi-locations.ts # Prachinburi districts & subdistricts list
│   ├── lib/
│   │   ├── contacts-store.ts        # Emergency contacts store & approval logic
│   │   ├── reports-store.ts         # Flood reports data management
│   │   ├── storage.ts               # Canvas-based client-side image compressor
│   │   └── supabase.ts              # Supabase Cloud Client
│   └── types/
│       └── index.ts                 # TypeScript interfaces
├── supabase/
│   └── schema.sql                   # SQL schema with RLS policies & tables
├── .env.example                     # Environment variables guide
├── .env.local                       # Local configuration (e.g. Admin PIN)
├── .gitignore                       # Git ignore rules
├── tailwind.config.ts               # Tailwind CSS theme configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

---

### ⚙️ Environment Variables

Create `.env.local` in the root directory:

```env
# Admin Passcode for /admin dashboard
NEXT_PUBLIC_ADMIN_PIN=admin8888

# Optional: Supabase configuration for cloud synchronization
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. Add environment variables (`NEXT_PUBLIC_ADMIN_PIN`) under **Environment Variables**.
5. Click **Deploy**. Your app will be live with free global HTTPS!

---

## 🤖 เครดิตการพัฒนา / Credits & Acknowledgements

* **พัฒนาและออกแบบร่วมกับ (Co-developed with):** **Google Gemini** (Gemini AI Models by **Google DeepMind**)
* **ขอบเขตงานที่สร้างโดย AI:**
  - สถาปัตยกรรม Next.js 14 App Router, TypeScript & Tailwind CSS
  - ระบบแผนที่เชิงโต้ตอบ Leaflet.js และการประมวลผล GeoJSON ขอบเขต 7 อำเภอของจังหวัดปราจีนบุรี
  - ระบบบีบอัดรูปภาพหน้างาน Client-Side Canvas Image Compression เพื่อประหยัดแบนด์วิดท์ในพื้นที่ภัยพิบัติ
  - ระบบตรวจสอบและลบรายงานก่อกวน (Admin Moderation Dashboard) และระบบอนุมัติเบอร์โทรฉุกเฉิน
* **สัญญาอนุญาต (License):** เผยแพร่ภายใต้สัญญาอนุญาต **MIT License** เพื่อสาธารณประโยชน์และการกู้ภัยพิบัติของประชาชน

---

### 🙏 ข้อความจากผู้จัดทำ / Note & Disclaimer

> **🇹🇭 หมายเหตุ:** โครงการนี้จัดทำขึ้นด้วยความตั้งใจเพื่อเป็นประโยชน์ต่อพี่น้องประชาชนชาวปราจีนบุรีและผู้ประสบภัยพิบัติ หากมีข้อผิดพลาด ข้อมูลคลาดเคลื่อน หรือข้อบกพร่องประการใด คณะผู้จัดทำต้องกราบขออภัยมา ณ ที่นี้ด้วยครับ/ค่ะ ท่านสามารถร่วมแจ้งปัญหาหรือเสนอแนะการปรับปรุงเพิ่มเติมผ่านทาง GitHub Issues ได้ตลอดเวลาครับ  
>  
> **🇬🇧 Disclaimer:** This project was created with good intentions to assist the residents of Prachinburi Province and disaster relief efforts. If there are any unintentional errors, inaccuracies, or shortcomings, we sincerely apologize. Feedback, issue reports, and contributions are always warmly welcomed via GitHub Issues.
