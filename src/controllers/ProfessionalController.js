const _professionalService = require('../domain/services/ProfessionalService')

/**
 * Controller class that access access the services and bring the results
 */
class ProfessionalController {
  async index (req, res) {
    const { professionals, statusCode } = await _professionalService.getAll()
    return res.status(statusCode).json(professionals)
  }

  async store (req, res) {
    const { professional, error, statusCode } = await _professionalService.create(req.body)

    if (error) {
      return res.status(statusCode).json(error)
    }

    return res.status(statusCode).json(professional)
  }
}

module.exports = new ProfessionalController()
