import React, { useState, useEffect } from 'react';
import { getUserDetails, updateUserDetails } from '../../services/api'; // Replace with appropriate API functions

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Fetch the user details from the backend API
      const response = await getUserDetails(); // Replace with appropriate API call
      setUserDetails(response);
      setName(response.name);
      setEmail(response.email);
      setAddresses(response.addresses);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      // Perform API call to update user details
      const updatedUser = {
        name: name,
        email: email,
        addresses: addresses,
      };
      await updateUserDetails(updatedUser); // Replace with appropriate API call
      setEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleCancel = () => {
    // Reset the form fields to the original values
    setName(userDetails.name);
    setEmail(userDetails.email);
    setAddresses(userDetails.addresses);
    setEditing(false);
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <label>Name:</label>
        {editing ? (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <span>{name}</span>
        )}
      </div>
      <div>
        <label>Email:</label>
        {editing ? (
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          <span>{email}</span>
        )}
      </div>
      <div>
        <h3>Addresses:</h3>
        {editing ? (
          addresses.map((address, index) => (
            <div key={index}>
              <label>Street:</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange(index, 'street', e.target.value)}//errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
              />
              {/* Add other address fields here */}
            </div>
          ))                    
        ) : (
          <ul>
            {addresses.map((address, index) => (
              <li key={index}>{address.street}</li>
              // Render other address fields here
            ))}
          </ul>
        )}
      </div>
      {editing ? (
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEdit}>Edit Profile</button>
      )}
    </div>
  );
}

export default Profile;
