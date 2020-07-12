
const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema(
  {
    monday: [{
      type: String
    }],
    tuesday: [{
      type: String
    }],
    wednesday: [{
      type: String
    }],
    thursday: [{
      type: String
    }],
    friday: [{
      type: String
    }],
    apointments: [{
      _id: false,
      date: String,
      slot: {
        start: {
          type: String,
          required: true
        },
        end: {
          type: String,
          required: true
        }
      }
    }],
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
      unique: true
    }
  },
  {
    timestamps:
      {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  }
)

module.exports = mongoose.model('Schedule', ScheduleSchema)
