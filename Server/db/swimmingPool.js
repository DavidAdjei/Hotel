const mongoose = require('mongoose');

const { Schema } = mongoose;


const swimmingPoolSchema = new Schema({
    clients: [{
        name: { 
            type: String,
            required: true,
        },
        phone: { 
            type: String,
            required: true,
        },
        history: [{
            swimStart: {
                date: {
                    type: String,
                    require: true
                },
                time: {
                    type: String,
                    require: true
                }
            },
            swimEnd: {
                date: {
                    type: String,
                    require: true
                },
                time: {
                    type: String,
                    require: true
                }
            },
            overseedBy: {
                employeeId: {
                    type: Schema.Types.ObjectId, 
                    ref: "Employee"
                },
                employeeName : String
            },
            amountCharged: {
                type: Number
            },
            hoursPaid: {
                type: Number
            }
        }],
        isSwimming: {
            type: Boolean,
            default: false
        },
        arrivalDate: {
            type: Date
        },
        numberOfHours: {
            type: Number
        },
        feedbacks: [
            {
                feedback: {
                    type: String
                },
                date: {
                    type: Date,
                    default: Date.now
                },
                employee: {
                    employeeId: {
                        type: Schema.Types.ObjectId,
                        ref: "Employee"
                    },
                    employeeName: String
                }
            }
        ]
    }],
});

module.exports = mongoose.model('SwimmingPool', swimmingPoolSchema);