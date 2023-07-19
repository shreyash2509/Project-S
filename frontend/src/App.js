import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Customer from './components/Customer';
import Seller from './components/Seller';

import CLogin from './components/customer/Login';
import CRegister from './components/customer/Register';
import CDashboard from './components/customer/Dashboard';

import SLogin from './components/seller/Login';
import SRegister from './components/seller/Register';
import SDashboard from './components/seller/Dashboard';
import SProducts from './components/seller/Products';
import SAddProduct from './components/seller/AddProduct';
import SOrders from './components/seller/Orders';
import Profile from './components/customer/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/seller" element={<Seller />} />

        <Route path="/seller/login" element={<SLogin />} />
        <Route path="/seller/register" element={<SRegister />} />
        <Route path="/seller/:sellerId/dashboard" element={<SDashboard />} />
        <Route path="/seller/:sellerId/products" element={<SProducts />} />
        <Route path="/seller/:sellerId/products/add" element={<SAddProduct />} />
        <Route path="/seller/:sellerId/orders" element={<SOrders />} />


        <Route path="/customer/login" element={<CLogin />} />
        <Route path="/customer/register" element={<CRegister />} />
        <Route path="/customer/:customerId/profile" element={<Profile />} />
        <Route path="/customer/:customerId/dashboard" element={<CDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
