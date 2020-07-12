const { celebrate, Segments, Joi } = require('celebrate')
const joiDaysValidationCreate = Joi
  .array().items(Joi.string().length(5).message('the format of time is HH:MM'))
  .length(2).message('size of array must be 2 `[hh:mm,hh:mm]`')

const joiDaysValidationUpdate = Joi.array().items(Joi.string().length(5).message('the format of time is HH:MM'))

class ScheduleValidator {
  create () {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        monday: joiDaysValidationCreate,
        tuesday: joiDaysValidationCreate,
        wednesday: joiDaysValidationCreate,
        thursday: joiDaysValidationCreate,
        friday: joiDaysValidationCreate
      }).min(1).max(5),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().length(24).required()
      }).length(1)
    })
  }

  update () {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        monday: joiDaysValidationUpdate,
        tuesday: joiDaysValidationUpdate,
        wednesday: joiDaysValidationUpdate,
        thursday: joiDaysValidationUpdate,
        friday: joiDaysValidationUpdate
      }).max(5),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().length(24).required(),
        scheduleId: Joi.string().length(24).required()
      }).length(2)
    })
  }

  destroy () {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().length(24).required(),
        scheduleId: Joi.string().length(24).required()
      }).length(2)
    })
  }
}

module.exports = new ScheduleValidator()
