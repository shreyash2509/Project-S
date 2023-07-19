const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller', 
    required: true,
  },  
  category: {
    type: String, // Add the category field as a String type
    
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
