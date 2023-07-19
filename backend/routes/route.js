const express = require("express");
const router = express.Router();
const ucontroller = require('../controllers/user-controller');
const scontroller = require('../controllers/s-controller');
const { authenticate } = require('../config/auth'); // Import the authentication middleware

router.post("/clogin", ucontroller.login);
router.post("/cregister", ucontroller.register);

router.post("/slogin", scontroller.login);
router.post("/sregister", scontroller.register);

// Protected route - Requires authentication
router.post("/s/addproducts", authenticate, scontroller.createProduct);

router.get('/s/allproducts', authenticate, scontroller.getProductsBySeller);

router.get('/c/products', scontroller.getAllProducts);

router.post('/c/category', authenticate,scontroller.createCategory);

// Get all categories
router.get('/c/category', scontroller.getAllCategories);

router.put('/products/:productId', authenticate, scontroller.updateProduct);
// GET products by category
router.get('/c/products/category/:category', scontroller.getProductsByCategory);


router.post('/cart/addCartItem',scontroller.addCartItem);
router.get('/c/allcartItems',scontroller.allCartItems);

router.put('/c/cartItems/:userId/:cartItemId', scontroller.updateCartItem);

router.delete('/c/cartItems/:userId/:cartItemId',scontroller.deleteCartItem);

module.exports = router;