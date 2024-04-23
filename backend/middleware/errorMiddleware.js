// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorMiddleware;
