// const express = require("express");
// const { createProduct, getAllProducts, getVendorProducts } = require("../controllers/productController");
// const { protect, authorize } = require("../middlewares/authMiddleware");

// const router = express.Router();

// // Public: Get all products
// router.get("/", getAllProducts);

// // Vendor: Create product
// router.post("/create", protect, authorize("vendor"), createProduct);

// // Vendor: Get vendor's own products
// router.get("/my-products", protect, authorize("vendor"), getVendorProducts);

// module.exports = router;
const express = require("express");
const { createProduct, getAllProducts, getVendorProducts, deleteProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public: Get all products
router.get("/", getAllProducts);

// // Vendor: Create product
// router.post("/create", protect, authorize("vendor"), createProduct);

// Vendor: Create product with image upload
router.post("/create", protect, authorize("vendor"), upload.array("images", 5), createProduct);

// Vendor: Get vendor's own products
router.get("/my-products", protect, authorize("vendor"), getVendorProducts);

// Admin/Vendor: Delete product
router.delete("/:id", protect, authorize("admin", "vendor"), deleteProduct);

module.exports = router;
