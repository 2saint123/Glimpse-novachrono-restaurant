const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

const ensurePasswordResetTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      code_hash VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role = "customer" } = req.body;
    const allowedRoles = ["customer", "waiter"];
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const trimmedName = String(fullName || "").trim();

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid account type" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (exists.length) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const status = role === "waiter" ? "pending" : "active";
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
      [trimmedName, normalizedEmail, phone || null, hashed, role, status]
    );

    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to Glimpse Kigali",
      html: `<h2>Registration successful</h2><p>Hello ${trimmedName}, your account was created successfully.</p>`
    });

    if (role === "waiter") {
      return res.status(201).json({ message: "Waiter registration submitted. Await admin approval." });
    }

    const token = signToken({ id: result.insertId, role, email: normalizedEmail });
    res.status(201).json({ token, user: { id: result.insertId, fullName: trimmedName, email: normalizedEmail, role, status } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status !== "active") return res.status(403).json({ message: "Account pending admin approval." });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mustChangePassword: !!user.must_change_password
      }
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name AS fullName, email, phone, role, status, must_change_password AS mustChangePassword FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    await pool.query("UPDATE users SET full_name = ?, phone = ? WHERE id = ?", [fullName, phone, req.user.id]);
    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    const valid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!valid) return res.status(400).json({ message: "Current password is incorrect" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?", [hashed, req.user.id]);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await ensurePasswordResetTable();
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const [rows] = await pool.query("SELECT id, full_name AS fullName, email FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.json({ message: "If that email exists, a reset code has been sent." });
    }

    const user = rows[0];
    const code = String(crypto.randomInt(100000, 999999));
    const codeHash = await bcrypt.hash(code, 10);

    await pool.query("DELETE FROM password_resets WHERE user_id = ?", [user.id]);
    await pool.query(
      "INSERT INTO password_resets (user_id, code_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
      [user.id, codeHash]
    );

    await sendEmail({
      to: user.email,
      subject: "Your Glimpse Kigali password reset code",
      html: `<p>Hello ${user.fullName},</p><p>Your password reset code is:</p><h2>${code}</h2><p>This code expires in 15 minutes.</p>`
    });

    res.json({ message: "If that email exists, a reset code has been sent." });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await ensurePasswordResetTable();
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    const { newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, code, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const [rows] = await pool.query(
      `SELECT u.id, pr.code_hash AS codeHash
       FROM users u
       JOIN password_resets pr ON pr.user_id = u.id
       WHERE u.email = ? AND pr.used_at IS NULL AND pr.expires_at > NOW()
       ORDER BY pr.created_at DESC
       LIMIT 1`,
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "Invalid or expired reset code" });

    const valid = await bcrypt.compare(code, rows[0].codeHash);
    if (!valid) return res.status(400).json({ message: "Invalid or expired reset code" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?", [hashed, rows[0].id]);
    await pool.query("UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL", [rows[0].id]);

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, updateProfile, changePassword, forgotPassword, resetPassword };
