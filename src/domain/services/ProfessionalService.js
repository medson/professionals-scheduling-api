const { Professional } = require('../models')

class ProfessionalService {
  async getAll () {
    const professionals = await Professional.find({}).sort('createdAt')
    return { professionals: professionals, statusCode: 200 }
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
