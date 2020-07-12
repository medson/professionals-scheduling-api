const { celebrate, Segments, Joi } = require('celebrate')

class ProfessionalValidator {
  create () {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required()
      })
    })
  }
}

module.exports = new ProfessionalValidator()
