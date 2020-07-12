const _scheduleService = require('../domain/services/ScheduleService')
/**
 * Controller class that access access the services and bring the results
 */
class ScheduleController {
  async index (req, res) {
    const { schedules, error, statusCode } = await _scheduleService.getAll()
    return res.status(statusCode).json(schedules)
  }

  async store (req, res) {
    const { schedule, error, statusCode } = await _scheduleService.create(req.params.id, req.body)

    if (error) return res.status(statusCode).json(error)

    return res.status(statusCode).json(schedule)
  }

  async update (req, res) {
    const { success, error, statusCode } = await _scheduleService.update(req.params, req.body)

    if (error) return res.status(statusCode).json(error)

    return res.status(statusCode).json(success)
  }

  async destroy (req, res) {
    const { success, error, statusCode } = await _scheduleService.delete(req.params)

    if (error) return res.status(statusCode).json(error)

    return res.status(statusCode).json(success)
  }
}

module.exports = new ScheduleController()
