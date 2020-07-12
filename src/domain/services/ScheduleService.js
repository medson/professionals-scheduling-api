const { Schedule } = require('../models')
const Helper = require('./helpers')
class ScheduleService {
  async getAll () {
    return await Schedule.find({}).populate('professional').select('-createdAt -updatedAt -__v')
  }

  async create (userId, scheduleData) {
    const checkIfExists = await Schedule.findOne({ professional: userId })

    if (checkIfExists) {
      return { schedule: null, error: { message: 'Already registered' } }
    }
    const { days, availability } = new Helper().setDaysRange(scheduleData)

    if (availability < 1) {
      return { schedule: null, error: { message: 'You need set at least one available slot' } }
    }

    const { monday, tuesday, wednesday, thursday, friday } = days

    const newProf = await Schedule.create({ professional: userId, monday, tuesday, wednesday, thursday, friday })

    return { schedule: { newProf }, error: null }
  }

  async update (params, dataToUpdate) {
    const keys = Object.keys(dataToUpdate)
    const schedule = await Schedule.findOne({ $and: [{ professional: params.id }, { _id: params.scheduleId }] })

    if (!schedule) return { success: null, error: { message: 'not found' } }

    const { days } = new Helper().setDaysRange(dataToUpdate)

    for (const key in keys) {
      schedule[keys[key]] = days[keys[key]]
    }
    await Schedule.findOneAndUpdate(schedule.id, schedule)

    return { success: { message: `schedule ${params.scheduleId} updated with success` }, error: null }
  }

  async delete (params) {
    const schedule = await Schedule.findOne({ $and: [{ professional: params.id }, { _id: params.scheduleId }] })

    if (!schedule) return { success: null, error: { message: 'not found' } }
    await Schedule.findByIdAndRemove(params.scheduleId)

    return { success: { message: `schedule ${params.scheduleId} deleted with success` }, error: null }
  }
}

module.exports = new ScheduleService()
