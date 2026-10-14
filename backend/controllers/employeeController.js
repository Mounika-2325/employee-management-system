const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s-]{7,15}$/;

const validateEmployeePayload = (payload) => {
  const trimmedName = String(payload.name || '').trim();
  const trimmedEmail = String(payload.email || '').trim();
  const trimmedPhone = String(payload.phone || '').trim();
  const trimmedPosition = String(payload.position || '').trim();
  const department = String(payload.department || '').trim();
  const salary = Number(payload.salary);
  const joiningDate = payload.joiningDate ? new Date(payload.joiningDate) : null;

  if (!trimmedName) return 'Name is required';
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) return 'Email must be valid';
  if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) return 'Phone number must be valid';
  if (!department) return 'Department is required';
  if (!trimmedPosition) return 'Position is required';
  if (!Number.isFinite(salary) || salary <= 0) return 'Salary should contain a valid number';
  if (!joiningDate || Number.isNaN(joiningDate.getTime())) return 'Joining date is required';

  return null;
};

const findEmployeeByIdOrCustomId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const employee = await Employee.findById(id);
    if (employee) return employee;
  }
  return Employee.findOne({ employeeId: id });
};

const getEmployeeList = async (req) => {
  const search = String(req.query.search || '').trim();
  const department = String(req.query.department || '').trim();
  const query = {};

  if (department && department !== 'All Departments') {
    query.department = department;
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } },
      { employeeId: { $regex: escapedSearch, $options: 'i' } },
      { position: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  return Employee.find(query).sort({ createdAt: -1 });
};

const getEmployees = async (req, res, next) => {
  try {
    const items = await getEmployeeList(req);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await findEmployeeByIdOrCustomId(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(employee);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      name: String(req.body.name || '').trim(),
      email: String(req.body.email || '').trim(),
      phone: String(req.body.phone || '').trim(),
      department: String(req.body.department || '').trim(),
      position: String(req.body.position || '').trim(),
      profileImage: String(req.body.profileImage || '').trim(),
      status: String(req.body.status || 'Active').trim(),
    };

    const validationError = validateEmployeePayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let employeeId = payload.employeeId;
    if (!employeeId) {
      const allEmployees = await Employee.find({}, { employeeId: 1 });
      let maxNum = 0;
      for (const emp of allEmployees) {
        const match = emp.employeeId?.match(/EMP-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      employeeId = `EMP-${String(maxNum + 1).padStart(3, '0')}`;
    }

    const newEmployee = new Employee({
      ...payload,
      employeeId,
      salary: Number(payload.salary),
      joiningDate: new Date(payload.joiningDate),
    });

    const savedEmployee = await newEmployee.save();
    return res.status(201).json(savedEmployee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      name: String(req.body.name || '').trim(),
      email: String(req.body.email || '').trim(),
      phone: String(req.body.phone || '').trim(),
      department: String(req.body.department || '').trim(),
      position: String(req.body.position || '').trim(),
      profileImage: String(req.body.profileImage || '').trim(),
      status: String(req.body.status || 'Active').trim(),
    };

    const validationError = validateEmployeePayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const employee = await findEmployeeByIdOrCustomId(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.set({
      ...payload,
      salary: Number(payload.salary),
      joiningDate: new Date(payload.joiningDate),
    });

    const updatedEmployee = await employee.save();
    return res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let employee = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findByIdAndDelete(id);
    }
    if (!employee) {
      employee = await Employee.findOneAndDelete({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json({ message: 'Employee deleted successfully', deletedId: id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
