const db = require("../database/configDb");

let allStudent;
exports.getStudent = async (req, res) => {
  try {
    const { search, color, major, level } = req.query;

    let sqlQuery = `SELECT * FROM students`;
    let params = [];
    let conditions = [];

    // Query
    if (search) {
      conditions.push("(first_name LIKE ? OR last_name LIKE ? OR student_code LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (color) {
      conditions.push("color = ?");
      params.push(color);
    }

    if (major) {
      conditions.push("major = ?");
      params.push(major);
    }

    if (level) {
      conditions.push("year_level = ?");
      params.push(level);
    }

    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ");
    }

    sqlQuery += " ORDER BY color, major";

    if (conditions.length > 0) {
      const studentQuery = await new Promise((resolve, reject) => {
        db.all(sqlQuery, params, (err, rows) => {
          if (err) {
            console.error("Error fetching students:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      return res.status(200).json({
        success: true,
        message: "Student data retrieved successfully",
        data: studentQuery
      });
    }

    if (!allStudent) {
      allStudent = await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM students ORDER BY color";
        db.all(sql, [], (err, rows) => {
          if (err) {
            console.error("Error fetching students:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student data retrieved successfully",
      data: allStudent
    });
  } catch (err) {
    console.error("Error in student controller:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student data",
      error: err.message || "Internal Server Error"
    });
  }
}

let allCommittee;
exports.getCommittee = async (req, res) => {
  try {
    if (!allCommittee) {
      allCommittee = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM committees ORDER BY position, full_name`;
        db.all(sql, [], (err, rows) => {
          if (err) {
            console.error("Error fetching committees:", err.message);
            resolve([]);
          } else {
            resolve(rows);
          }
        }
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cmmittee data retrieved successfully",
      data: allCommittee
    });
  } catch (err) {
    console.error("Error in committees controller:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch committees data",
      error: err.message || "Internal Server Error"
    });
  }
}