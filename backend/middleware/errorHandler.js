const mongoose = require('mongoose');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  if (
    mongoose.connection.readyState !== 1
    || ['MongoNetworkError', 'MongoServerSelectionError', 'MongoNotConnectedError'].includes(err?.name)
  ) {
    return res.status(503).json({ message: 'Database connection unavailable' });
  }

  if (err?.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0];
    const message = duplicateField === 'email'
      ? 'Email already registered'
      : 'Employee ID already registered';
    return res.status(409).json({ message });
  }

  if (err?.name === 'ValidationError') {
    const message = Object.values(err.errors || {})[0]?.message || 'Employee data is invalid';
    return res.status(400).json({ message });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Something went wrong. Please try again.'
    : err.message;

  return res.status(statusCode).json({ message });
};

module.exports = { ApiError, notFoundHandler, errorHandler };
