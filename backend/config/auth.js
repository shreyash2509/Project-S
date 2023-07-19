const jwt = require('jsonwebtoken');
const Seller = require('../models/seller');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Assuming the token is sent in the Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, 'eJTh1dk20cVz9M2pt32DFG4rJkKl8h5Ksfrgh');

    // Find the seller by the decoded sellerId
    const seller = await Seller.findById(decodedToken.sellerId);
    if (!seller) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the seller object to the request for further use
    req.user = seller;
    // console.log(req.user);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { authenticate };
