# 🚋 MUTramTime (Mahidol University Tram Schedule)

> เว็บแอปพลิเคชันสำหรับเช็คตารางเดินรถรางภายในมหาวิทยาลัยมหิดล พร้อมฟีเจอร์เรียงลำดับป้ายตามพิกัดปัจจุบันของผู้ใช้งาน

![Project Banner](Tram.png)
*(ใช้รูป Tram.png ที่มีใน Repo เป็นโลโก้ หรือภาพประกอบได้เลยครับ)*

## 📖 เกี่ยวกับโปรเจกต์ (About The Project)

**MUTramTime** เป็นโปรเจกต์ที่พัฒนาขึ้นเพื่อแก้ปัญหาความยุ่งยากในการค้นหาตารางเวลารถราง โดยระบบจะใช้เทคโนโลยี **Geolocation** เพื่อระบุตำแหน่งของผู้ใช้งาน และนำไปคำนวณเปรียบเทียบกับพิกัดของป้ายรถรางแต่ละป้าย (Station Coordinates)

ผลลัพธ์ที่ได้คือ **User Interface ที่แสดงป้ายรถรางที่อยู่ "ใกล้ตัวที่สุด" ขึ้นมาเป็นอันดับแรก** ทำให้ผู้ใช้งานไม่ต้องเสียเวลาเลื่อนหาป้ายที่ตัวเองยืนอยู่ ช่วยให้การวางแผนการเดินทางภายในมหาวิทยาลัยสะดวกรวดเร็วยิ่งขึ้น

### ✨ ฟีเจอร์หลัก (Key Features)

* **📍 Smart Geolocation Sorting:** ขอสิทธิ์เข้าถึง GPS ของผู้ใช้ เพื่อคำนวณระยะทางและเรียงลำดับรายชื่อป้ายจาก "ใกล้ที่สุด" ไป "ไกลที่สุด" โดยอัตโนมัติ
* **🕒 Real-time Schedule Info:** สามารถกดเลือกที่ชื่อป้ายเพื่อดูตารางเวลา (Timetable) ของรถรางแต่ละสายที่ผ่านจุดนั้นๆ ได้
* **📱 Mobile-First Design:** ออกแบบ UI ให้ใช้งานง่ายบนสมาร์ทโฟน เน้นความรวดเร็วในการโหลด

## 🛠️ เทคโนโลยีที่ใช้ (Built With)

พัฒนาด้วย Native Web Technologies เพื่อประสิทธิภาพและความเบาของแอปพลิเคชัน:

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) **HTML5** - โครงสร้างหน้าเว็บ
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) **CSS3** - ตกแต่ง UI ให้สวยงามและรองรับหน้าจอมือถือ
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) **JavaScript (Vanilla)** - หัวใจหลักของระบบ ทำหน้าที่:
    * เรียกใช้ **Geolocation API** ของ Browser
    * คำนวณระยะทางระหว่างพิกัด (Distance Calculation Logic)
    * จัดการ DOM Manipulation เพื่อแสดงผลข้อมูล

## 📂 โครงสร้างไฟล์ (File Structure)

```text
├── 📄 index.html      # หน้าจอหลัก (User Interface)
├── 📄 script.js       # โค้ดคำนวณ GPS, ระยะทาง และข้อมูลตารางเดินรถ
├── 📄 style.css       # ไฟล์ตกแต่งหน้าตาแอปพลิเคชัน
└── 🖼️ Tram.png        # รูปภาพไอคอน/กราฟิกประกอบ
```
## 🚀 วิธีการใช้งาน (Getting Started)
เนื่องจากโปรเจกต์นี้มีการเรียกใช้ Location Service การทดสอบบนเครื่อง Local จำเป็นต้องกดอนุญาต (Allow) การเข้าถึงตำแหน่ง

1. Clone โปรเจกต์:

Bash
```
git clone [https://github.com/guide1121/MUTramTime.git](https://github.com/guide1121/MUTramTime.git)
```

2. เปิดใช้งาน:

* เปิดไฟล์ index.html ผ่าน Web Browser

* สำคัญ: Browser จะเด้งหน้าต่างขออนุญาตเข้าถึงตำแหน่ง (Location Permission) ให้กด "Allow" (อนุญาต) เพื่อให้ฟีเจอร์เรียงลำดับป้ายทำงานได้สมบูรณ์
