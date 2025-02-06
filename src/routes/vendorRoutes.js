const express = require("express");
const { getAllVendors, getVendorProfile, approveVendor } = require("../controllers/vendorController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin can view all vendors
router.get("/all", protect, authorize("admin"), getAllVendors);

// Vendor can view their profile
router.get("/profile", protect, authorize("vendor"), getVendorProfile);

router.put("/approve/:id", protect, authorize("admin"), approveVendor);


module.exports = router;
