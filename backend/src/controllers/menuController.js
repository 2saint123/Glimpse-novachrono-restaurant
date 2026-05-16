const pool = require("../config/db");

const getMenu = async (req, res, next) => {
  try {
    const { q = "", category = "" } = req.query;
    const categoryGroups = {
      Foods: ["Foods", "Breakfast", "Lunch", "Dinner"],
      Drinks: ["Drinks"],
      Desserts: ["Desserts"]
    };
    const selectedCategories = categoryGroups[category] || (category ? [category] : []);

    let query = `SELECT m.id, m.name, m.description, m.price, m.image_url AS imageUrl, c.name AS category
       FROM menu_items m
       JOIN categories c ON c.id = m.category_id
       WHERE (? = '' OR (m.name LIKE CONCAT('%', ?, '%') OR m.description LIKE CONCAT('%', ?, '%'))) `;
    const params = [q, q, q];

    if (selectedCategories.length) {
      const placeholders = selectedCategories.map(() => "?").join(", ");
      query += `AND c.name IN (${placeholders}) `;
      params.push(...selectedCategories);
    }

    query += "ORDER BY m.created_at DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await pool.query(
      "INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, categoryId, imageUrl]
    );
    res.status(201).json({ message: "Menu item created" });
  } catch (err) {
    next(err);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await pool.query(
      `UPDATE menu_items
       SET name=?, description=?, price=?, category_id=?, image_url = COALESCE(?, image_url)
       WHERE id=?`,
      [name, description, price, categoryId, imageUrl, id]
    );
    res.json({ message: "Menu item updated" });
  } catch (err) {
    next(err);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM menu_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };
