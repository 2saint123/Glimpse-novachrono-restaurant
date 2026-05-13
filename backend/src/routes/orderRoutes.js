const router = require("express").Router();
const c = require("../controllers/orderController");
const { verifyToken, allowRoles } = require("../middleware/auth");

router.post("/", verifyToken, allowRoles("customer"), c.placeOrder);
router.get("/mine", verifyToken, allowRoles("customer"), c.myOrders);
router.get("/waiter", verifyToken, allowRoles("waiter"), c.waiterOrders);
router.patch("/:id/status", verifyToken, allowRoles("admin", "waiter"), c.updateOrderStatus);

module.exports = router;
