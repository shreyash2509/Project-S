import React, { useState, useEffect } from 'react';
import { addProduct, createCategory, getAllCategories } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import withAuth from '../../services/withAuth';
import ReactModal from 'react-modal';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
  },
};

const AddProduct = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('sellerId');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'addNew') {
      setCategory('');
    } else {
      setCategory(selectedCategory);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory) {
        throw new Error('Category name is required');
      }
  
      setIsLoading(true);
  
      await createCategory(newCategory); // Pass the category name as a string
  
      setNewCategory('');
  
      // Refetch categories after adding a new category
      await fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!category) {
        throw new Error('Category is required');
      }

      await addProduct({ title, description, price, stock, category });

      console.log('Product added successfully');

      // Clear form fields after successful submission
      setTitle('');
      setDescription('');
      setPrice(0);
      setStock(0);
      setCategory('');
    } catch (error) {
      console.error('Failed to add product:', error);
      // Handle error or display error message to the user
    }
  };

  const handleBackDashboard = () => {
    // Navigate to the page displaying seller orders
    navigate(`/seller/${sellerId}/dashboard`);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <select value={category} onChange={handleCategoryChange} required>
          <option value="">Select a category</option>
          {categories &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        
          <div>
            <button type="button" onClick={handleToggleModal}>
              Add Category
            </button>
            <ReactModal isOpen={showModal} onRequestClose={handleToggleModal} style={customModalStyles}>
              <h2>Add New Category</h2>
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={handleNewCategoryChange}
                required
              />
              <button type="button" onClick={handleAddCategory} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Category'}
              </button>
            </ReactModal>
          </div>
        
        <button type="submit">Add Product</button>
      </form>
      <button onClick={handleBackDashboard}>Dashboard</button>
    </div>
  );
};

export default withAuth(AddProduct);
