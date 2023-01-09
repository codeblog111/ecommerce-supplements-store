const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @dec       Fetch all products
// @route     GET /api/products?category=protein
// @access    Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category ? {category: req.query.category} : {}
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword, ...category });

  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch a single products
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @dec       Delete a single product
// @route     DELETE /api/products/:id
// @access    Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @dec       Create a single product
// @route     POST /api/products
// @access    Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: 'images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @dec       Update a single product
// @route     PUT /api/products/:id
// @access    Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
  } else {
    res.status(404);
    throw new Error('Product not found');
  }

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @dec       Create new review
// @route     POST /api/products/:id/reviews
// @access    Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewd = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewd) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  } else {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.save();

  res.status(201).json({ message: 'Review added' });
});

// @dec       Get top rated products
// @route     Get /api/products/top
// @access    Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// @dec       Fetch latest products up to 4
// @route     GET /api/products/latest
// @access    Public
const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ updatedAt: -1 }).limit(4);
  res.json({ products });
});

// @dec       Fetch Protein Products
// @route     GET /api/products/trending?category=protein
// @access    Public
const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.query.category })
    .sort({ updatedAt: -1 })
    .limit(4);
  res.json({ products });
});

module.exports = {
  getProducts,
  getProductById,
  getLatestProducts,
  getTrendingProducts,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
