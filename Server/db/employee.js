const mongoose = require("mongoose");

const { Schema } = mongoose;

const logSchema = new Schema({
    type: {
        type: String,
        enum: ['login', 'logout'],
        required: true
    },
    timestamp: {
        type: Date
    }
});

const employeeSchema = new Schema({
    name: { 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        houseNumber: String
    },
    employeeDetails: {
        hireDate: Date,
        salary: Number
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    logs: [logSchema]
});

// Define a virtual property to group logs by date
employeeSchema.virtual('logsByDate').get(function() {
    const logsByDate = {};

    this.logs.forEach(log => {
        const dateKey = log.timestamp.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
        if (!logsByDate[dateKey]) {
            logsByDate[dateKey] = { login: 0, logout: 0 };
        }
        logsByDate[dateKey][log.type]++;
    });

    return logsByDate;
});

module.exports = mongoose.model("Employee", employeeSchema);
