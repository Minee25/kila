const path = require("path");
const fs = require("fs").promises;

const filePath = path.join(__dirname, "students.txt");

async function readFileAndInsert(db) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.trim().split("\n");

    const studentCodesInFile = [];
    const students = lines.map(line => {
      // const [firstName, lastName, studentCode, year, major, color] = line.split(/\s+/);
      const [fullName, studentCode, year, major, color] = line.split("\t");
      const [firstName, lastName] = fullName.split(" ");
      studentCodesInFile.push(studentCode);
      return { studentCode, firstName, lastName, year, major, color };
    })

    await new Promise((resolve, reject) => {
      const placeholders = studentCodesInFile.map(() => '?').join(',');
      const sql = `DELETE FROM students WHERE student_code NOT IN (${placeholders})`;
      db.run(sql, studentCodesInFile, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    students.forEach(student => {
      const sql = `INSERT OR REPLACE INTO students (student_code, first_name, last_name, year_level, major, color) VALUES (?, ?, ?, ?, ?, ?)`;
      db.run(sql, [
        student.studentCode,
        student.firstName,
        student.lastName,
        student.year,
        student.major,
        student.color
      ], (err) => {
        if (err) {
          console.error("Insert error:", err.message);
        }
      });
    });
    console.log("All students inserted.");
  } catch (err) {
    console.error(err);
  }
}

module.exports = readFileAndInsert;