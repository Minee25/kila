const db = require("../database/configDb");

exports.home = async (req, res) => {
  const locals = {
    title: "Kila",
    description: "Kila",
    header: "Page header",
    layout: 'layouts/main'
  }

  try {
    const rows = await new Promise((resolve, reject) => {
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

    locals.results = rows;
    locals.searchQuery = '';
    locals.colorQuery = '';
    locals.majorQuery = '';
    locals.committees = [];
    res.render("index", locals);
  } catch (err) {
    console.error("Error in users controller:", err);
    res.status(500).send("Error fetching students");
  }
}

exports.search = async (req, res) => {
  const locals = {
    title: "Kila",
    description: "Kila",
    header: "Page header",
    layout: 'layouts/main'
  }


  try {
    const { q, color, major } = req.query;
    // สร้าง SQL query และ parameters
    let sql = "SELECT * FROM students";
    let params = [];
    let conditions = [];

    // Filter search
    if (q) {
      conditions.push("(first_name LIKE ? OR last_name LIKE ? OR student_code LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (color) {
      conditions.push("color = ?");
      params.push(color);
    }

    if (major) {
      conditions.push("major = ?");
      params.push(major);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY color, major";

    const rows = await new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error("Error fetching students:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    let committees = [];
    if (color) {
      committees = await new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM committees WHERE color = ? ORDER BY position, full_name",
          [color],
          (err, rows) => {
            if (err) {
              console.error("Error fetching committees:", err.message);
              resolve([]); // Don't block students if committee fails
            } else {
              resolve(rows);
            }
          }
        );
      });
    }

    locals.results = rows;
    locals.searchQuery = q;
    locals.colorQuery = color;
    locals.majorQuery = major;
    locals.committees = committees;
    res.render("index", locals);
  } catch (err) {
    console.error("Error in users controller:", err);
    res.status(500).send("Error fetching students");
  }
};
