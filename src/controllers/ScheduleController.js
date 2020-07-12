const _scheduleService = require('../domain/services/ScheduleService')
/**
 * Controller class that access access the services and bring the results
 */
class ScheduleController {
  async index (req, res) {
    const schedules = await _scheduleService.getAll()
    return res.status(200).json(schedules)
  }

  async store (req, res) {
    const { schedule, error } = await _scheduleService.create(req.params.id, req.body)

    if (error) return res.status(400).json(error)

    return res.status(201).json(schedule)
  }

  async update (req, res) {
    const { success, error } = await _scheduleService.update(req.params, req.body)

    if (error) return res.status(404).json(error)

    return res.status(200).json(success)
  }

  async destroy (req, res) {
    const { success, error } = await _scheduleService.delete(req.params)

    if (error) return res.status(404).json(error)

    return res.status(200).json(success)
  }
}

module.exports = new ScheduleController()
