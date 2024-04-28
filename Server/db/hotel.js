const mongoose = require('mongoose');

const { Schema } = mongoose;

const editRecordSchema = new Schema({
  editedBy: {
        employeeId: {
            type: Schema.Types.ObjectId, 
            ref: "Employee"
        },
        employeeName : String
    },
  editedFields: {
    type: [
      {
        field: { type: String, required: true },
        valueBefore: { type: mongoose.Schema.Types.Mixed },
        valueAfter: { type: mongoose.Schema.Types.Mixed },
      }
    ],
  },
  editedAt: {
    type: Date,
    default: Date.now,
  }
});



const hotelSchema = new Schema({
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
            checkIn: {
                date: {
                    type: String,
                    require: true
                },
                time: {
                    type: String,
                    require: true
                }
            },
            checkOut: {
                date: {
                    type: String,
                    require: true
                },
                time: {
                    type: String,
                    require: true
                }
            },
            roomNumber: {
                type: String,
                required: true
            },
            checkedInBy: {
                employeeId: {
                    type: Schema.Types.ObjectId, 
                    ref: "Employee"
                },
                employeeName : String
            },
            amountCharged: {
                type: Number
            }
        }],
        isCheckedIn: {
            type: Boolean,
            default: false
        },
        arrivalDate: {
            type: Date
        },
        numberOfDays: {
            type: Number,
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
    items: [{
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        stockQuantity: {
            type: Number,
        },
        editHistory: [editRecordSchema]
    }]
});

module.exports = mongoose.model('Hotel', hotelSchema);