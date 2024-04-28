const Employee = require("../db/employee");
const Restaurant = require("../db/restaurant");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth");

exports.signUp = async (req, res) => {
    console.log("Preparing to Add Employee");
    try {
        const { name, email, password, salary, phone } = req.body;
        if (!name) {
            return res.json({
                error: "Name is required"
            })
        } else if (!email) {
            return res.json({
                error: "Email is required"
            })
        } else if (!salary) {
            return res.json({
                error: "Salary is required"
            })
        }else if (!phone) {
            return res.json({
                error: "Phone number is required"
            })
        }else if (!password || password.length < 5) {
            return res.json({
                error: "Password is required and should be more than 8 characters"
            })
        } else {
            const exist = await Employee.findOne({ email });
            if (exist) {
                return res.json({
                    error: "Email is taken"
                })
            } else {
                const hashedPassword = await hashPassword(password);
                try {
                    const employee = await new Employee({
                        name,
                        email,
                        password: hashedPassword,
                        phone,
                        employeeDetails: { salary: salary }
                    }).save();

                    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
                        expiresIn: "7d",
                    })

                    const { password, ...rest } = employee._doc;
                    return res.json({
                        token, user: rest,
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            
        }
    } catch (err) {
        console.log(err)
    }
}

exports.signin = async (req, res) => {
    console.log("Preparing to Sign In");
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.json({
                error: "Email or Password is incorrect"
            })
        } else {
            const match = await comparePassword(password, employee.password);
            if (!match) {
                return res.json({
                    error: "Password is incorrect"
                })
            } else {
                
                const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                })
                employee.password = undefined;
                employee.secret = undefined;
                res.json({
                    token, employee,
                })
            }
        }
    } catch (err) {
        console.log(err)
    }
}

exports.allEmployees = async (req, res) => {
  try {
      const employees = await Employee.find({});
    res.json({ employees: employees });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.makeAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
        }
        existingEmployee.isAdmin = true;
        const updatedEmployee = await existingEmployee.save();
        res.json({ updatedEmployee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.removeAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
        }
        existingEmployee.isAdmin = false;
        const updatedEmployee = await existingEmployee.save();
        res.json({ updatedEmployee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getEmployeeLogs = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Extract logs from the employee document
        const logs = employee.logs;

        res.json({ logs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.viewOrders = async (req, res) => { 
    try {
        const restaurant = await Restaurant.findOne();
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        } else {
            const orders = restaurant.orders;
            res.json({ orders });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.logout = async (req, res) => {
    res.json({ token: null });
}