const path = require("path");
const fs = require("fs").promises;

const filePath = path.join(__dirname, "committees.txt");

async function readCommitteeFileAndInsert(db) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.trim().split("\n");

    const committeeNamesInFile = [];
    const committees = lines.map(line => {
      const [fullName, position, color] = line.split("\t");
      committeeNamesInFile.push(fullName);
      return { fullName, position, color };
    });

    // 1. ดึงข้อมูลที่มีอยู่ใน DB ก่อน
    const existingCommittees = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM committees`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const committeeMap = new Map();
    existingCommittees.forEach(c => {
      committeeMap.set(c.full_name, c);
    });

    // 2. ลบข้อมูลที่ไม่มีในไฟล์แล้ว
    const placeholders = committeeNamesInFile.map(() => '?').join(',');
    await new Promise((resolve, reject) => {
      const sql = `DELETE FROM committees WHERE full_name NOT IN (${placeholders})`;
      db.run(sql, committeeNamesInFile, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    // 3. Insert เฉพาะกรณีข้อมูลเปลี่ยน หรือยังไม่มี
    for (const committee of committees) {
      const existing = committeeMap.get(committee.fullName);
      const changed = !existing ||
        existing.position !== committee.position ||
        existing.color !== committee.color ||
        existing.role !== 'committee';

      if (changed) {
        const sql = `INSERT OR REPLACE INTO committees (full_name, position, color, role) VALUES (?, ?, ?, 'committee')`;
        db.run(sql, [
          committee.fullName,
          committee.position,
          committee.color
        ], (err) => {
          if (err) {
            console.error("Committee insert error:", err.message);
          }
        });
      }
    }

    console.log("Committees updated.");
  } catch (err) {
    console.error(err);
  }
}

module.exports = readCommitteeFileAndInsert;
