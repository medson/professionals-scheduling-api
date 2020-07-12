const { Professional } = require('../models')

class ProfessionalService {
  getAll () {
    return Professional.find({})
  }

  async create (professionalData) {
    if (await Professional.findOne({ email: professionalData.email })) {
      return { professional: null, error: { message: 'Bad request' }, statusCode: 400 }
    }

    const newProf = await Professional.create(professionalData)
    return { professional: newProf, error: null, statusCode: 201 }
  }
}

module.exports = new ProfessionalService()
