import Product from "../models/product.model.js";

/**
 * @route   POST /api/products
 *  @access  Admin only
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || !price || !image || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields..!",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product:product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();

    res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * @route   GET /api/products/:id
 *  @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid product ID formate",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 *
 * @param { @route   PUT /api/products/:id}
 * @param {*@access  Admin only} 
 *
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @access  Admin only
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted success!",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID formate",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
