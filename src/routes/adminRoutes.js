const express = require("express");
const { createStaff, getAllUsers } = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Only Admin can create staff
router.post("/create-staff", protect, authorize("admin"), createStaff);

// Admin can view all users
router.get("/users", protect, authorize("admin"), getAllUsers);

module.exports = router;
