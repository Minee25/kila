# kila

เว็บไซต์สำหรับดูรายชื่อในการแข่งขันกีฬาสี

## รายละเอียดโปรเจกต์

kila เป็นเว็บแอปพลิเคชันที่ใช้สำหรับแสดงรายชื่อผู้เข้าร่วมการแข่งขันกีฬาสีในแต่ละสาขาและคณะกรรมการ โดยพัฒนาโดยใช้ Node.js, Express และ EJS

## ฟีเจอร์

- แสดงรายชื่อผู้เข้าร่วมแต่ละคณะ/คณะกรรมการ
- ระบบฐานข้อมูลสำหรับจัดเก็บข้อมูลนักเรียนและคณะกรรมการ
- อินเทอร์เฟซที่ใช้งานง่าย

## การติดตั้งและใช้งาน

1. **โคลนโปรเจกต์**
   ```bash
   git clone https://github.com/yourusername/kila.git
   cd kila
   ```

2. **ติดตั้ง dependencies**
   ```bash
   npm install
   ```

3. **รันเซิร์ฟเวอร์**
   ```bash
   npm start
   ```
   หรือ
   ```bash
   node index.js
   ```

4. **เข้าใช้งาน**
   เปิดเว็บเบราว์เซอร์และไปที่ `http://localhost:3000` (หรือพอร์ตที่กำหนดไว้)

## โครงสร้างโปรเจกต์

```
kila/
├── index.js                # ไฟล์หลักสำหรับรันเซิร์ฟเวอร์
├── package.json            # ข้อมูล dependencies และสคริปต์
├── src/
│   ├── controllers/        # ตัวควบคุม logic ต่าง ๆ
│   ├── database/           # ไฟล์ฐานข้อมูลและสคริปต์ที่เกี่ยวข้อง
│   ├── routes/             # กำหนดเส้นทาง (routes) ของแอป
│   └── views/              # ไฟล์ EJS สำหรับแสดงผล
└── public/                 # ไฟล์ static (CSS, รูปภาพ)
```

## เทคโนโลยีที่ใช้

- Node.js
- Express.js
- EJS
- SQLite
- Tailwind CSS

## API

  ### ดึงข้อมูลนิสิตทั้งหมด
  ```bash
  /api/get-student
  ```

  **Responses**
  ```json
  {
    "success": true,
    "message": "Student data retrieved successfully",
    "data": [
      {
        "student_id": 1,
        "student_code": "6601121****",
        "first_name": "นายสมชาย",
        "last_name": "ชมชาย",
        "year_level": 3,
        "major": "วิทยาการคอมพิวเตอร์ CS",
        "color": "ชมพู"
      },
      {
        "student_id": 2,
        "student_code": "6801121****",
        "first_name": "นายสมรัก",
        "last_name": "สมรัก",
        "year_level": 1,
        "major": "วิทยาการข้อมูลประยุกต์ ADS",
        "color": "ชมพู"
      },
    ]
  }
  ```

  ### กรองข้อมูลนิสิตด้วยการส่ง Parameters
  ```bash
  /api/get-student?search=
  /api/get-student?color=
  /api/get-student?major=
  /api/get-student?level=
  /api/get-student?search=&color=&major=&level=
  ```
  **Responses**

  ```json
  {
    "success": true,
    "message": "Student data retrieved successfully",
    "data": [
      {
        "student_id": 4,
        "student_code": "67011212152",
        "first_name": "นางสาวสมหญิง",
        "last_name": "สมหญิง",
        "year_level": 3,
        "major": "วิทยาการคอมพิวเตอร์ CS",
        "color": "แดง"
      },
      {
        "student_id": 5,
        "student_code": "67011216014",
        "first_name": "นางสาวหวานใจ",
        "last_name": "หวานใจ",
        "year_level": 3,
        "major": "วิทยาการคอมพิวเตอร์ CS",
        "color": "แดง"
      },
    ]
  }
  ```

  ### ดึงข้อมูลคณะกรรมการ
  ```bash
  /api/get-committee
  ```

  **Responses**
  ```json
  {
    "success": true,
    "message": "Cmmittee data retrieved successfully",
    "data": [
      {
        "id": 1,
        "full_name": "อาจารย์สมใจ สมใจ",
        "position": "กรรมการ",
        "color": "เหลือง",
        "role": "committee"
      },
      {
        "id": 2,
        "full_name": "ผู้ช่วยศาสตราจารย์สมสมัย สมสมัย",
        "position": "กรรมการ",
        "color": "แดง",
        "role": "committee"
      },
    ]
  }
  ```

## ผู้พัฒนา

- Thaksin Mualsuk
