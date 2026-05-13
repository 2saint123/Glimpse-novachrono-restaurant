const router = require("express").Router();
const c = require("../controllers/reservationController");
const { verifyToken, allowRoles } = require("../middleware/auth");

router.get("/availability", c.getAvailability);
router.post("/", verifyToken, allowRoles("customer"), c.createReservation);
router.get("/mine", verifyToken, allowRoles("customer"), c.myReservations);
router.patch("/:id/cancel", verifyToken, allowRoles("customer"), c.cancelReservation);
router.patch("/:id/approve", verifyToken, allowRoles("admin"), c.approveReservation);
router.patch("/:id/reject", verifyToken, allowRoles("admin"), c.rejectReservation);

module.exports = router;
