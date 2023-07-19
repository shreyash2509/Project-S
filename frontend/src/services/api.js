import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const loginCustomer = async (email, password) => {
  try {
    const response = await api.post('/clogin', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerCustomer = async (name, email, password) => {
  try {
    const response = await api.post('/cregister', { name, email, password});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginSeller = async (email, password) => {
  try {
    const response = await api.post('/slogin', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerSeller = async (name, email, password) => {
  try {
    const response = await api.post('/sregister', { name, email, password});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token'); // Assuming the token is stored in the local storage
    const headers = {
      'authorization': `${token}`,
      'Content-Type': 'application/json',
    };
    const response = await api.post('/s/addproducts', productData ,{ headers });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductsBySeller = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `${token}`, // Update the authorization header format
      'Content-Type': 'application/json',
    };
    const response = await api.get('/s/allproducts', { headers, params: { sellerId } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await api.get('/c/products');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/c/products/category/${category}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const createCategory = async (name) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `${token}`,
      'Content-Type': 'application/json',
    };
    const response = await api.post('/c/category', { name }, { headers });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get('/c/category');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProduct = async (productId, updatedProduct) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `${token}`,
      'Content-Type': 'application/json',
    };
    const response = await api.put(`/products/${productId}`, updatedProduct, { headers });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addCartItem = async (userId, cartItem) => {
  try {
    const data = {
      userId,
      cartItem,
    };
    const response = await api.post('/cart/addCartItem', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getCartItems = async (userId) => {
  try {
    const response = await api.get(`/c/allcartItems?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updateCartItem = async (userId, cartItemId, updateData) => {
  try {
    const response = await api.put(`/c/cartItems/${userId}/${cartItemId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  } 
};

export const deleteCartItem = async (userId, cartItemId) => {
  try {
    const response = await api.delete(`/c/cartItems/${userId}/${cartItemId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/details`); // Replace with the correct API endpoint
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user details
export const updateUserDetails = async (userId,updatedUser) => {
  try {
    const response = await api.post(`/user/${userId}/update`, updatedUser); // Replace with the correct API endpoint
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export default api;
