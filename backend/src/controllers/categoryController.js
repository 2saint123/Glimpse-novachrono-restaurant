const pool = require("../config/db");

const getCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM categories ORDER BY name");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };