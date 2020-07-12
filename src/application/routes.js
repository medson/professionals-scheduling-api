const express = require('express')
const routes = express.Router()
const { ProfessionalController, ScheduleController, ApointmentController } = require('../controllers/index')
const { ProfessionalValidator, ScheduleValidator, AppointmentValidator } = require('../domain/validators')

routes.get('/health', (req, res) => { res.status(200).json({ status: 'OK' }) })

routes.get('/professional', ProfessionalController.index)
routes.post('/professional', ProfessionalValidator.create(), ProfessionalController.store)

routes.get('/schedule', ScheduleController.index)
routes.post('/professional/:id/schedule', ScheduleValidator.create(), ScheduleController.store)
routes.put('/professional/:id/schedule/:scheduleId', ScheduleValidator.update(), ScheduleController.update)
routes.delete('/professional/:id/schedule/:scheduleId', ScheduleValidator.destroy(), ScheduleController.destroy)

routes.post('/apointment', AppointmentValidator.create(), ApointmentController.store)
routes.get('/apointment', AppointmentValidator.get(), ApointmentController.index)

module.exports = routes
