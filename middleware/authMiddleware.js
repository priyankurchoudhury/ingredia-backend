const jwt = require('jsonwebtoken');

// This function checks if the user is logged in
// It runs BEFORE protected routes (like saving favorites)
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // User is valid, continue to the route
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = protect;