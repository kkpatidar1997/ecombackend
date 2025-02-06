// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     category: { type: String, required: true },
//     priceOld: { type: Number, required: true },
//     priceNew: { type: Number, required: true },
//     discount: { type: Number },
//     expiryDate: { type: Date, required: true },
//     freeDelivery: { type: Boolean, default: false },
//     deliveryAmount: { type: Number, default: 0 },
//     vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     productURL: { type: String, unique: true, required: true },
//     images: [{ type: String }],
//   },
//   { timestamps: true }
// );

// // Automatically calculate discount percentage
// ProductSchema.pre("save", function (next) {
//   this.discount = ((this.priceOld - this.priceNew) / this.priceOld) * 100;
//   next();
// });

// module.exports = mongoose.model("Product", ProductSchema);

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priceOld: { type: Number, required: true },
    priceNew: { type: Number, required: true },
    discount: { type: Number },
    expiryDate: { type: Date, required: true },
    freeDelivery: { type: Boolean, default: false },
    deliveryAmount: { type: Number, default: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productURL: { type: String, unique: true, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Auto-calculate discount before saving
ProductSchema.pre("save", function (next) {
  this.discount = ((this.priceOld - this.priceNew) / this.priceOld) * 100;
  this.discount = parseFloat(this.discount.toFixed(2)); // Keep only 2 decimal places
  next();
});

// Ensure product URL is unique
ProductSchema.pre("save", async function (next) {
  if (!this.productURL) {
    this.productURL = this.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
