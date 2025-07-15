const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const readFileAndInsert = require("./insertStudentDb");
const readCommitteeFileAndInsert = require("./insertCommitteeDb");

const dbPath = path.join(__dirname, "students.db");

const studentDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

function createTable() {
  studentDb.run(`
    CREATE TABLE IF NOT EXISTS students (
      student_id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_code TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      year_level INTEGER NOT NULL,
      major TEXT NOT NULL,
      color TEXT NOT NULL
    );  
  `, (err) => {
    if (err) {
      console.error("Error creating diary table:", err.message);
    }
  });
}

function createCommitteeTable() {
  studentDb.run(`
    CREATE TABLE IF NOT EXISTS committees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      position TEXT NOT NULL,
      color TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'committee'
    );
  `, (err) => {
    if (err) {
      console.error("Error creating committees table:", err.message);
    }
  });
}

studentDb.serialize(() => {
  createTable(); 
  createCommitteeTable();
  readFileAndInsert(studentDb);
  readCommitteeFileAndInsert(studentDb);
});

process.on('SIGINT', () => {
  studentDb.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = studentDb; 