import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsBySeller, getAllCategories, updateProduct } from '../../services/api';

import { useNavigate } from 'react-router-dom';

import withAuth from '../../services/withAuth';

const Products = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState(0);
  const [updatedStock, setUpdatedStock] = useState(0);
  const [updatedCategory, setUpdatedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsBySeller(sellerId);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [sellerId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === '') {
      // If no category is selected, show all products
      setFilteredProducts(products);
    } else {
      // Filter products based on selected category
      setFilteredProducts(products.filter((product) => product.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  const handleGoBack = () => {
    navigate(`/seller/${sellerId}/dashboard`);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setUpdatedTitle(product.title);
    setUpdatedDescription(product.description);
    setUpdatedPrice(product.price);
    setUpdatedStock(product.stock);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
  
    try {
      const updatedProduct = {
        ...editingProduct,
        _id: editingProduct._id, // Include the product ID
        title: updatedTitle,
        description: updatedDescription,
        price: updatedPrice,
        stock: updatedStock,
        category: updatedCategory, // Include the updated category
      };
  
      await updateProduct(editingProduct._id, updatedProduct);
      // Update the product in the local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? { ...product, ...updatedProduct } : product
        )
      );
      // Clear the editing state
      setEditingProduct(null);
      setUpdatedTitle('');
      setUpdatedDescription('');
      setUpdatedPrice(0);
      setUpdatedStock(0);
      setUpdatedCategory('');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };
  
  return (
    <div>
      <h1>Products</h1>
      <div>
        <h3>Filter by Category:</h3>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {filteredProducts.map((product) => (
        <div key={product._id}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          {editingProduct && editingProduct._id === product._id ? (
  <>
    <input
      type="text"
      value={updatedTitle || editingProduct.title}
      onChange={(e) => setUpdatedTitle(e.target.value)}
    />
    <input
      type="text"
      value={updatedDescription || editingProduct.description}
      onChange={(e) => setUpdatedDescription(e.target.value)}
    />
    <input
      type="number"
      value={updatedPrice || editingProduct.price}
      onChange={(e) => setUpdatedPrice(Number(e.target.value))}
    />
    <input
      type="number"
      value={updatedStock || editingProduct.stock}
      onChange={(e) => setUpdatedStock(Number(e.target.value))}
    />
    <select
      value={updatedCategory || editingProduct.category}
      onChange={(e) => setUpdatedCategory(e.target.value)}
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
    <button onClick={handleUpdateProduct}>Save</button>
  </>
) : (
  <button onClick={() => handleEditProduct(product)}>Edit</button>
)}


          <hr />
        </div>
      ))}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default withAuth(Products);
