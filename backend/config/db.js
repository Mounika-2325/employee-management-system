const mongoose = require('mongoose');

const connectDB = async (exitOnError = true) => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri || mongoUri === 'YOUR_MONGODB_ATLAS_CONNECTION_STRING') {
    console.error('MongoDB connection error: MONGODB_URI environment variable is not configured');
    if (exitOnError) {
      process.exit(1);
    }
    throw new Error('MONGODB_URI is not configured');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'employee_management',
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error: Failed to connect to MongoDB Atlas');
    if (exitOnError) {
      process.exit(1);
    }
    throw new Error('MongoDB connection failed');
  }
};

module.exports = { connectDB };

