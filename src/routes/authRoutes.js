const express = require("express");
const { signup, login } = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

// Only Admin can access this route
router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
