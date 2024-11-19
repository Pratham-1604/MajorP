const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Validate the studentId
    if (!mongoose.Types.ObjectId.isValid(decoded.studentId)) {
      return res.status(400).send({ message: 'Invalid Student ID' });
    }
    console.log(decoded);
    req.studentId = decoded.studentId;
    console.log(req.studentId); 
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
