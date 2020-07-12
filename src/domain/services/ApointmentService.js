const { Schedule, Professional } = require('../models')
const Helper = require('./helpers')
const basicHelper = new Helper()

class AppointmentService {
  async getAll (queryParams) {
    const { from, to } = queryParams
    const dateFilter = basicHelper.getCurrentDay()
    const weekday = `${dateFilter}.0`
    const selectParams = dateFilter + ' apointments'

    const query = {}
    query[weekday] = { $exists: true }

    const todaySchedule = await Schedule.find(query).select(selectParams).populate('professional')

    for (const key in todaySchedule) {
      if (queryParams.from) {
        todaySchedule[key][dateFilter] = new Helper(todaySchedule[key][dateFilter], false, 1, from).searchByRange()
      }
      if (queryParams.to) {
        todaySchedule[key][dateFilter] = new Helper(todaySchedule[key][dateFilter], true, 2, to).searchByRange()
      }

      todaySchedule[key].apointments.forEach(apointment => {
        todaySchedule[key][dateFilter].forEach(x => {
          if (x.startsWith(apointment.slot.start) || x.endsWith(apointment.slot.end)) {
            todaySchedule[key][dateFilter] = basicHelper.remove(todaySchedule[key][dateFilter], x)
          }
        })
      })
    }
    return { schedules: todaySchedule, statusCode: 200 }
  }

  async create (appointmentData) {
    const { professionalId, date, time } = appointmentData

    if (!await Professional.findById(professionalId)) {
      return { success: null, error: { message: 'professional not found' }, statusCode: 404 }
    }
    // parse date to prepare query and check if have choosen date
    const formatDate = `${date}T${time}:00`
    const parseDate = new Date(formatDate)
    const selectedDay = basicHelper.getCurrentDay(parseDate.getDay())
    const dayToAppointment = `${selectedDay}.0`

    const query = {}
    query[dayToAppointment] = { $exists: true }
    const scheduleAvailability = await Schedule.findOne({ professional: professionalId }).select(selectedDay + ' apointments')// find(query).select(selectedDay)

    if (!scheduleAvailability[selectedDay].length) {
      return { success: null, error: { message: 'the professional dont have schedule for selected day' }, statusCode: 400 }
    }

    const newAppointment = { slot: { start: '', end: '' }, date: '' }

    // check if have availability slot for selected date
    for (const key in scheduleAvailability[selectedDay]) {
      const nextKey = scheduleAvailability[selectedDay][parseInt(key) + 1]
      const currentKey = scheduleAvailability[selectedDay][key]

      if (currentKey.startsWith(time) && nextKey !== undefined) {
        newAppointment.slot.start = currentKey.slice(0, 5)
        newAppointment.slot.end = nextKey.slice(8)
        newAppointment.date = formatDate
      }
    }

    if (newAppointment.date.length <= 1) return { success: null, error: { message: 'the professional have not this slot available' }, statusCode: 400 }

    const haveAvailability = basicHelper.checkAvailability(scheduleAvailability.apointments, newAppointment)

    if (!haveAvailability) return { succcess: null, error: { message: 'the professional have not this slot available' }, statusCode: 400 }

    // available, update
    scheduleAvailability.apointments.push(newAppointment)

    await Schedule.findByIdAndUpdate(scheduleAvailability._id, scheduleAvailability)
    return { success: 'updated', error: null, statusCode: 200 }
  }
}

module.exports = new AppointmentService()
