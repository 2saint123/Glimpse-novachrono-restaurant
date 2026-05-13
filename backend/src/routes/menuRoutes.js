const router = require("express").Router();
const c = require("../controllers/menuController");
const upload = require("../middleware/upload");
const { verifyToken, allowRoles } = require("../middleware/auth");

router.get("/", c.getMenu);
router.post("/", verifyToken, allowRoles("admin"), upload.single("image"), c.createMenuItem);
router.put("/:id", verifyToken, allowRoles("admin"), upload.single("image"), c.updateMenuItem);
router.delete("/:id", verifyToken, allowRoles("admin"), c.deleteMenuItem);

module.exports = router;
