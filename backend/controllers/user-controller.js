const Customer=require('../models/customer')
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if Customer with the same email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new Customer in the database
    const customer = new Customer({
      name,
      email,
      password: hashedPassword,
    });
    await customer.save();
    
    res.json({customer});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password using argon2
    const passwordMatch = await argon2.verify(customer.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ customerId: customer._id }, 'eJTh1dk20cVz9M2pt32DFG4rJkKl8h5Ksfrgh');

    // Return the token to the client
    res.json({ token , customerId: customer._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// productController.js
// const Product = require('../models/product');
// Get all products
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

module.exports = { register ,login,getAllProducts,getProductsByCategory};