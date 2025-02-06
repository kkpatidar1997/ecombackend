const User = require("../models/User");

// Get All Vendors (Admin Only)
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password");
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Vendor Profile (Vendor Only)
exports.getVendorProfile = async (req, res) => {
  try {
    res.json({ vendor: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get All Vendors (Admin Only)
exports.getAllVendors = async (req, res) => {
  try {
   const vendors = await User.find({ role: "vendor", status: "pending" }).select("-password");

    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Approve Vendor (Admin Only)
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = "approved";
    await vendor.save();

    res.json({ message: "Vendor approved successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
