require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Employee = require('./models/Employee');

const sampleEmployees = [
  {
    employeeId: 'EMP-001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '9876543210',
    department: 'IT',
    position: 'Developer',
    salary: 65000,
    joiningDate: new Date('2022-04-15'),
  },
  {
    employeeId: 'EMP-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    department: 'HR',
    position: 'HR Manager',
    salary: 72000,
    joiningDate: new Date('2021-08-02'),
  },
  {
    employeeId: 'EMP-003',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@example.com',
    phone: '9876543212',
    department: 'Finance',
    position: 'Accountant',
    salary: 61000,
    joiningDate: new Date('2020-11-09'),
  },
  {
    employeeId: 'EMP-004',
    name: 'Anjali Rao',
    email: 'anjali.rao@example.com',
    phone: '9876543213',
    department: 'Marketing',
    position: 'Marketing Executive',
    salary: 58000,
    joiningDate: new Date('2023-01-16'),
  },
  {
    employeeId: 'EMP-005',
    name: 'Mounika Sunkari',
    email: 'mounika.sunkari@example.com',
    phone: '9876543214',
    department: 'IT',
    position: 'Frontend Developer',
    salary: 70000,
    joiningDate: new Date('2022-06-20'),
  },
  {
    employeeId: 'EMP-006',
    name: 'Kiran Kumar',
    email: 'kiran.kumar@example.com',
    phone: '9876543215',
    department: 'Sales',
    position: 'Sales Executive',
    salary: 56000,
    joiningDate: new Date('2021-03-08'),
  },
  {
    employeeId: 'EMP-007',
    name: 'Neha Patel',
    email: 'neha.patel@example.com',
    phone: '9876543216',
    department: 'Operations',
    position: 'Operations Manager',
    salary: 76000,
    joiningDate: new Date('2019-09-23'),
  },
  {
    employeeId: 'EMP-008',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    phone: '9876543217',
    department: 'IT',
    position: 'Backend Developer',
    salary: 68000,
    joiningDate: new Date('2023-05-01'),
  },
].map((employee) => ({
  ...employee,
  status: 'Active',
  profileImage: '',
}));

const seedEmployees = async () => {
  try {
    await connectDB();
    let insertedCount = 0;
    let existingCount = 0;

    for (const employee of sampleEmployees) {
      const exists = await Employee.findOne({
        $or: [{ email: employee.email }, { employeeId: employee.employeeId }],
      });

      if (!exists) {
        await Employee.create(employee);
        insertedCount++;
      } else {
        existingCount++;
      }
    }

    console.log(`Seed complete. Inserted ${insertedCount} new employee(s); ${existingCount} already present.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedEmployees();
}

module.exports = { seedEmployees, sampleEmployees };
