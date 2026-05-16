const router = require("express").Router();
const c = require("../controllers/adminController");
const { verifyToken, allowRoles } = require("../middleware/auth");

router.use(verifyToken, allowRoles("admin"));

// Dashboard & Analytics
router.get("/dashboard", c.dashboardStats);
router.get("/analytics", c.getAnalytics);

// Customer Management
router.get("/customers", c.listCustomers);
router.get("/customers/:id", c.getCustomerDetails);

// Payment Management
router.get("/payments", c.listPayments);
router.get("/payments/stats", c.getPaymentStats);

// Order Management
router.get("/orders", c.listOrders);
router.get("/orders/:id", c.getOrderDetails);
router.patch("/orders/:id/status", c.updateOrderStatus);

// Reservation Management
router.get("/reservations", c.listReservations);

// Waiter Management
router.get("/waiters", c.listWaiters);
router.patch("/waiters/:id/approve", c.approveWaiter);
router.patch("/waiters/:id/reject", c.rejectWaiter);

// Table Management
router.get("/tables", c.listTables);
router.patch("/tables/:id/status", c.updateTableStatus);

// User Management
router.get("/users", c.listUsers);

module.exports = router;
