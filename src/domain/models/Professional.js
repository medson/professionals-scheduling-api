
const mongoose = require('mongoose')

const ProfessionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
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

module.exports = mongoose.model('Professional', ProfessionalSchema)
