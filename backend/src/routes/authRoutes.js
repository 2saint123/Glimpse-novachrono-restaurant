const router = require("express").Router();
const c = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);
router.get("/me", verifyToken, c.me);
router.put("/me", verifyToken, c.updateProfile);
router.put("/change-password", verifyToken, c.changePassword);

module.exports = router;
