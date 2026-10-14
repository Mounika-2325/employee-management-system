require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const configuredClientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL;
if (configuredClientUrl) {
  configuredClientUrl.split(',').forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. Render health checks, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow explicitly configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow any localhost/127.0.0.1 origin during development
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);

    // Allow all Vercel production and preview domains (*.vercel.app)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const database = isConnected ? 'connected' : 'disconnected';
  const statusCode = isConnected ? 200 : 503;

  res.status(statusCode).json({
    status: isConnected ? 'ok' : 'error',
    service: 'Employee Management API',
    database,
  });
});

app.use('/api/employees', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database connection unavailable' });
  }

  return next();
});

app.use('/api/employees', employeeRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    return server;
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };

