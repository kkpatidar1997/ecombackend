const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create Staff (Only Admin)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if staff already exists
    let staff = await User.findOne({ email });
    if (staff) return res.status(400).json({ message: "Staff already exists" });

    // Create staff with role 'staff'
    staff = new User({ name, email, password, role: "staff" });
    await staff.save();

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
