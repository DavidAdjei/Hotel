const moment = require('moment');
const Employee = require("../db/employee");

// Middleware for login
const loginMiddleware = async (req, res, next) => {
    const {email} = req.body; // Assuming you have middleware to set req.user with user information

    try {
        const employee = await Employee.findOne({ email });

        if (employee) {
            const loggedInToday = employee.logs.some(log => log.type === 'login' && moment(log.timestamp).isSame(moment(), 'day'));

            if (!loggedInToday) {
                // Save login time
                employee.logs.push({ type: 'login', timestamp: new Date() });
                await employee.save();
            }
            next();
        } else {
            next();
        }

        // Check if user has already logged in today
        
    } catch (error) {
        // Handle error
        next(error);
    }
};

// Middleware for logout
const logoutMiddleware = async (req, res, next) => {
    const userId = req.params.userId; // Assuming you have middleware to set req.user with user information

    try {
        const employee = await Employee.findById(userId);

        // Check if user has logged out today, if yes, update logout time
        const loggedOutTodayIndex = employee.logs.findIndex(log => log.type === 'logout' && moment(log.timestamp).isSame(moment(), 'day'));

        if (loggedOutTodayIndex === -1) {
            // Save logout time
            employee.logs.push({ type: 'logout', timestamp: new Date() });
            await employee.save();
        } else {
            // Update existing logout time
            employee.logs[loggedOutTodayIndex].timestamp = new Date();
            await employee.save();
        }

        next();
    } catch (error) {
        // Handle error
        next(error);
    }
};

module.exports = { loginMiddleware, logoutMiddleware };
