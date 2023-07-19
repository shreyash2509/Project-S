import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllCategories, addCartItem, getCartItems, updateCartItem, deleteCartItem } from '../../services/api';
import withAuth from '../../services/withAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  const userId = localStorage.getItem('customerId');
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response);
      setFilteredProducts(response);
    } catch (error) {
      console.error('Error retrieving products:', error.response);
    }
  };

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem('customerId');
      const response = await getCartItems(userId);
      setCartItems(response);
    } catch (error) {
      console.error('Error retrieving cart items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error retrieving categories:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/customer');
  }; 
  const handleProfile = () => {
    navigate(`/customer/${userId}/profile`);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterProducts(category, searchQuery); // Filter products based on category and search query
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(selectedCategory, query); // Filter products based on category and search query
  };

  const filterProducts = (category, query) => {
    let filtered = products;

    if (category !== '') {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (query !== '') {
      const lowercasedQuery = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(lowercasedQuery) ||
          product.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredProducts(filtered);
  };

const addToCart = async (product, x) => {
  try {
    const userId = localStorage.getItem('customerId');

    const existingCartItem = cartItems.find((item) => item.productId === product._id);
    let cartid;
    const quancart = existingCartItem?.quantity || 0;

    if (existingCartItem) {
      cartid = existingCartItem._id;

      if (x === 1) {
        const updatedCartItems = cartItems.map((item) => {
          if (item.productId === product._id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
        await updateCartItem(userId, cartid, { quantity: quancart + 1 });

        setCartItems(updatedCartItems);
      } else if (x === -1 && quancart > 0) {
        const updatedCartItems = cartItems.map((item) => {
          if (item.productId === product._id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        if (quancart === 1) {
          await deleteCartItem(userId, cartid);
          setCartItems(updatedCartItems.filter((item) => item.productId !== product._id));
        } else {
          await updateCartItem(userId, cartid, { quantity: quancart - 1 });
          setCartItems(updatedCartItems);
        }
      }
    } else {
      const newCartItem = {
        productId: product._id,
        sellerId: product.seller,
        quantity: 1,
      };

      await addCartItem(userId, newCartItem); // Await the addCartItem function call
      fetchCartItems();

      // Update the products state with the added product
      // ...
    }
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};





  // Calculate the total price of the items in the cart
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);
      if (product && product.price) {
        totalPrice += product.price * item.quantity;
      }
    });
    return totalPrice.toFixed(2);
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <label htmlFor="category">Select Category:</label>
      <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={searchQuery} onChange={handleSearchChange} />

      <h3>Products:</h3>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product._id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <div>
        <h3>Cart:</h3>
        <p>Total Items: {cartItems && cartItems.length}</p>
        <ul>
          {cartItems &&
            cartItems.map((item, index) => {
              const product = products.find((p) => p._id === item.productId);
              return (
                <li key={index}>
                  {product && product.title} - Quantity: <button onClick={() => addToCart(product, 1)}>+</button>{' '}
                  {item.quantity} <button onClick={() => addToCart(product, -1)}>-</button>
                </li>
              );
            })}
        </ul>
        <p>Total Price: {calculateTotalPrice()}</p>
      </div>
      <h1>profile</h1>
      <button onClick={handleProfile}>Profile</button>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default withAuth(Dashboard);
