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

    if (!allStudent) {
      console.log("00000")
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

    if (conditions.length > 0) {
      const filtered = allStudent.filter((student) => {
        return (!search || student.first_name.includes(search) || student.last_name.includes(search) || student.student_code.includes(search)) &&
          (!color || student.color === color) &&
          (!major || student.major === major) &&
          (!level || student.year_level === Number(level));
      });

      return res.status(200).json({
        success: true,
        message: "Filtered students retrieved successfully",
        data: filtered
      });

    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Student data retrieved successfully",
      data: allStudent
    });
  } catch (err) {
    console.error("Error in student controller:", err);
    return res.status(500).json({
      status: 500,
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
      status: 200,
      success: true,
      message: "Cmmittee data retrieved successfully",
      data: allCommittee
    });
  } catch (err) {
    console.error("Error in committees controller:", err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch committees data",
      error: err.message || "Internal Server Error"
    });
  }
}