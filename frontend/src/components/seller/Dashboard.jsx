import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from '../../services/withAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('sellerId');

  const handleLogout = () => {
    // Remove the token and sellerId from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('sellerId');

    // Navigate to the login page
    navigate('/seller');
  };

  const handleViewAllProducts = () => {
    // Navigate to the page displaying all products for the seller
    navigate(`/seller/${sellerId}/products`);
  };

  const handleAddProduct = () => {
    // Navigate to the page for adding a new product for the seller
    navigate(`/seller/${sellerId}/products/add`);
  };

  const handleViewOrders = () => {
    // Navigate to the page displaying seller orders
    navigate(`/seller/${sellerId}/orders`);
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <ul>
        <li>
          <button onClick={handleViewAllProducts}>View All Products</button>
        </li>
        <li>
          <button onClick={handleAddProduct}>Add Product</button>
        </li>
        <li>
          <button onClick={handleViewOrders}>View Orders</button>
        </li>
      </ul>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default withAuth(Dashboard);
