const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'],
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
    min: [0, 'Salary must be a valid number'],
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active',
  },
  profileImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
