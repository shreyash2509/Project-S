const Seller = require('../models/seller');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose')
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if a Seller with the same email already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new Seller in the database
    const seller = new Seller({
      name,
      email,
      password: hashedPassword,
    });
    await seller.save();

    res.json({ seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password using argon2
    const passwordMatch = await argon2.verify(seller.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ sellerId: seller._id }, 'eJTh1dk20cVz9M2pt32DFG4rJkKl8h5Ksfrgh');
    
    // Return the token to the client
    res.json({ token, sellerId: seller._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//********************************************************************************************************************************* */

// productController.js

const Product = require('../models/product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock ,category} = req.body;
    const sellerId = req.user._id;
    const product = new Product({
      title,
      description,
      price,
      stock,
      seller: sellerId,
      category
    });

    await product.save();

    res.status(201).json({ success: true, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};


const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.query.sellerId;

    // Fetch products based on sellerId
    const products = await Product.find({ seller: sellerId }).populate('seller');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const Category = require('../models/category');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Create a new category in the database
    const category = new Category({ name });
    await category.save();

    res.status(201).json({ success: true, message: 'Category created successfully' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log(categories);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProductData = req.body;

    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Find the product by ID and update its data
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products.' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products by category.' });
  }
};

const Cart = require('../models/cart');


const addCartItem = async (req, res) => {
  const { userId, cartItem } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
      });
    }

    const { productId, sellerId, quantity } = cartItem;

    const existingProductIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId && product.sellerId.toString() === sellerId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, sellerId, quantity });
    }

    await cart.save();
// console.log(cart);
    // Retrieve the updated cart with populated product details
    // const updatedCart = await Cart.findById(cart._id).populate('products.productId');

    res.json({ cart }); // Return the cartId property

  } catch (error) {
    console.error('Error adding cart item:', error);
    res.status(500).json({ success: false, message: 'Failed to add cart item' });
  }
};




const allCartItems=async (req, res) => {
  const { userId } = req.query;
  try {
    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart doesn't exist, return an empty array
      return res.status(200).json([]);
    }

    // Return the cart items
    res.status(200).json(cart.products);
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ message: 'Failed to retrieve cart items' });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.params;
    const { quantity } = req.body;
    // Find the cart item by userId and cartItemId
    const cartItem = await Cart.findOneAndUpdate(
      { userId, 'products._id': cartItemId }, // Find by userId and matching product _id
      { $set: { 'products.$.quantity': quantity } }, // Update the quantity of the matching product
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const deleteCartItem = async (req, res) => {
  const { userId, cartItemId } = req.params;

  try {
    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the index of the cart item in the products array
    const cartItemIndex = cart.products.findIndex((product) => product._id.toString() === cartItemId);

    if (cartItemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Remove the cart item from the products array
    cart.products.splice(cartItemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};

module.exports = { updateCartItem,deleteCartItem,register, login ,createProduct,getProductsBySeller,createCategory,getAllCategories,updateProduct,getProductsByCategory,getAllProducts,addCartItem,allCartItems};
