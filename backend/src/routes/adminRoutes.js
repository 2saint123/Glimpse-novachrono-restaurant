const router = require("express").Router();
const c = require("../controllers/adminController");
const { verifyToken, allowRoles } = require("../middleware/auth");

router.use(verifyToken, allowRoles("admin"));
router.get("/dashboard", c.dashboardStats);
router.get("/reservations", c.listReservations);
router.get("/waiters", c.listWaiters);
router.patch("/waiters/:id/approve", c.approveWaiter);
router.patch("/waiters/:id/reject", c.rejectWaiter);
router.get("/tables", c.listTables);
router.patch("/tables/:id/status", c.updateTableStatus);

module.exports = router;
