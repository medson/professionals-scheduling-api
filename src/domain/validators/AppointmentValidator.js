const { celebrate, Segments, Joi } = require('celebrate')

class AppointmentValidator {
  get () {
    return celebrate({
      [Segments.QUERY]: Joi.object().keys({
        from: Joi.string().length(5).message('Time string format is HH:mm'),
        to: Joi.string().length(5).message('Time string format is HH:mm')

      })
    })
  }

  create () {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        professionalId: Joi.string().length(24).required(),
        date: Joi.string().length(10).message('Date string format is YYYY-mm-DD').required(),
        time: Joi.string().length(5).message('Time string format is HH:mm').required()
      })
    })
  }
}

module.exports = new AppointmentValidator()
