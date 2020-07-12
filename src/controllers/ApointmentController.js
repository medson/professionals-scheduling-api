const _appointmentService = require('../domain/services/ApointmentService')

/**
 * Controller class that access access the services and bring the results
 */
class ApointmentController {
  async index (req, res) {
    const { schedules, statusCode } = await _appointmentService.getAll(req.query)

    return res.status(statusCode).json(schedules)
  }

  async store (req, res) {
    const { success, error, statusCode } = await _appointmentService.create(req.body)

    if (error) return res.status(statusCode).json(error)

    return res.status(statusCode).json(success)
  }
}

module.exports = new ApointmentController()
