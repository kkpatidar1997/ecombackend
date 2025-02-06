// const Product = require("../models/Product");

// // Create Product (Vendor Only)
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, category, priceOld, priceNew, expiryDate, freeDelivery, deliveryAmount } = req.body;

//     // Unique URL
//     const productURL = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

//     const product = new Product({
//       name,
//       description,
//       category,
//       priceOld: parseFloat(priceOld).toFixed(2),
//       priceNew: parseFloat(priceNew).toFixed(2),
//       expiryDate,
//       freeDelivery,
//       deliveryAmount: freeDelivery ? 0 : parseFloat(deliveryAmount).toFixed(2),
//       vendor: req.user._id,
//       productURL,
//     });

//     await product.save();
//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get All Products (Public)
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("vendor", "name email");
//     res.json({ products });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get Vendor's Products (Vendor Only)
// exports.getVendorProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ vendor: req.user._id });
//     res.json({ products });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const Product = require("../models/Product");

// Create Product (Vendor Only)
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, category, priceOld, priceNew, expiryDate, freeDelivery, deliveryAmount } = req.body;

//     // Check for unique product URL
//     const productURL = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

//    // Handle image upload
//     let imagePaths = [];
//     if (req.files) {
//       imagePaths = req.files.map((file) => file.path);
//     }

//     const product = new Product({
//       name,
//       description,
//       category,
//       priceOld: parseFloat(priceOld).toFixed(2),
//       priceNew: parseFloat(priceNew).toFixed(2),
//       expiryDate: new Date(expiryDate),
//       freeDelivery,
//       deliveryAmount: freeDelivery ? 0 : parseFloat(deliveryAmount).toFixed(2),
//       vendor: req.user._id,
//       productURL,
//     });

//     await product.save();
//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, expiryDate, freeDelivery, deliveryAmount } = req.body;

    // Check for unique product URL
    const productURL = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    // Handle image upload
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map((file) => file.path);
    }

    const product = new Product({
      name,
      description,
      category,
      priceOld: parseFloat(priceOld).toFixed(2),
      priceNew: parseFloat(priceNew).toFixed(2),
      expiryDate: new Date(expiryDate),
      freeDelivery,
      deliveryAmount: freeDelivery ? 0 : parseFloat(deliveryAmount).toFixed(2),
      vendor: req.user._id,
      productURL,
      images: imagePaths,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get All Products (Public)
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("vendor", "name email")
//       .sort({ createdAt: -1 });

//     res.json({ products });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// Get All Products with Search, Pagination & Filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, vendor } = req.query;

    const query = {};
     
    // Hide expired products
const currentDate = new Date();
query.expiryDate = { $gte: currentDate };

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.priceNew = {};
      if (minPrice) query.priceNew.$gte = parseFloat(minPrice);
      if (maxPrice) query.priceNew.$lte = parseFloat(maxPrice);
    }

    // Filter by vendor
    if (vendor) {
      query.vendor = vendor;
    }

    // Apply pagination
    const products = await Product.find(query)
      .populate("vendor", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Product.countDocuments(query);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), products });


  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Vendor's Products (Vendor Only)
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Product (Vendor/Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only the vendor or admin can delete
    if (req.user.role !== "admin" && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
