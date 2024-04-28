const mongoose = require('mongoose');

const { Schema } = mongoose;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description given"
    }
});


const restaurantSchema = new Schema({
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
    ],
    dishes: [dishSchema],
    orders: [{
        items: [{
            dish: {
                type: Schema.Types.ObjectId,
                ref: "Dish"
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        orderDate: {
            type: Date,
            default: Date.now
        }
    }]
});
module.exports = mongoose.model('Restaurant', restaurantSchema);