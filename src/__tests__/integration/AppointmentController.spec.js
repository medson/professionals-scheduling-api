
const app = require('../../application/app')
const req = require('supertest')
const { Professional, Schedule } = require('../../domain/models')
const ScheduleService = require('../../domain/services/ScheduleService')
const ApointmentService = require('../../domain/services/ApointmentService')
const Helper = require('../../domain/services/helpers')
const todayEver = new Date()
const today = new Helper().getCurrentDay(todayEver.getDay())
describe('Appointment Controller integration', () => {
  beforeEach(async () => {
    await Professional.remove()
    await Schedule.remove()
  })

  it('it should be able to list all professionals availabilities', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        monday: ['08:30', '19:00'],
        tuesday: ['08:30', '19:00'],
        thursday: ['08:30', '19:00'],
        wednesday: ['08:30', '19:00'],
        friday: ['08:30', '19:00']
      })
    await ApointmentService.create({
      professionalId: professional._id,
      date: todayEver.toLocaleDateString('pt-br'),
      time: '10:30'
    })

    const response = await req(app)
      .get('/api/v1/appointment')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0][today].length).toBeGreaterThan(0)
  })

  it('it should be able to list all professionals availabilities with start range filter', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        monday: ['08:30', '19:00'],
        tuesday: ['08:30', '19:00'],
        thursday: ['08:30', '19:00'],
        wednesday: ['08:30', '19:00'],
        friday: ['08:30', '19:00']
      })
    const response = await req(app)
      .get(`/api/v1/appointment?from=${'09:00'}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0][today].length).toBeGreaterThan(0)
    expect(response.body[0][today][0]).toBe('09:00 - 09:30')
  })

  it('it should be able to list all professionals availabilities with end range filter', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        monday: ['08:30', '19:00'],
        tuesday: ['08:30', '19:00'],
        thursday: ['08:30', '19:00'],
        wednesday: ['08:30', '19:00'],
        friday: ['08:30', '19:00']
      })
    const response = await req(app)
      .get(`/api/v1/appointment?to=${'12:30'}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0][today].length).toBeGreaterThan(0)
    expect(response.body[0][today].reverse()[0]).toBe('12:00 - 12:30')
  })

  it('it should be able to list all professionals availabilities with start and end range filters', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        monday: ['08:30', '19:00'],
        tuesday: ['08:30', '19:00'],
        thursday: ['08:30', '19:00'],
        wednesday: ['08:30', '19:00'],
        friday: ['08:30', '19:00']
      })
    const response = await req(app)
      .get(`/api/v1/appointment?from=${'09:30'}&to=${'11:30'}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0][today].length).toBe(4)
    expect(response.body[0][today][0]).toBe('09:30 - 10:00')
    expect(response.body[0][today].reverse()[0]).toBe('11:00 - 11:30')
  })

  it('it should be able to create an appointment', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        wednesday: ['08:30', '13:30'],
        friday: ['14:00', '19:00']
      })

    const response = await req(app)
      .post('/api/v1/appointment').send({
        professionalId: professional._id,
        date: '2020-07-31',
        time: '15:30'
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('Appointment created')
  })

  it('it should not be able to create an appointment in a not available day for select professional', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        wednesday: ['08:30', '13:30'],
        friday: ['14:00', '19:00']
      })

    const response = await req(app)
      .post('/api/v1/appointment').send({
        professionalId: professional._id,
        date: '2020-07-30',
        time: '15:30'
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('the professional dont have schedule for selected day')
  })

  it('it should not be able to create an appointment at busy time slot', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    await ScheduleService.create(
      professional._id,
      {
        wednesday: ['08:30', '13:30'],
        friday: ['14:00', '19:00']
      })

    await ApointmentService.create({
      professionalId: professional._id,
      date: '2020-07-31',
      time: '15:30'
    })

    const response = await req(app)
      .post('/api/v1/appointment').send({
        professionalId: professional._id,
        date: '2020-07-31',
        time: '15:30'
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('the professional have not this slot available')
  })

  it('it should not be able to create an appointment with non existent professional', async () => {
    const response = await req(app)
      .post('/api/v1/appointment').send({
        professionalId: '000000000000000000000000',
        date: '2020-07-31',
        time: '15:30'
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('professional not found')
  })
})

afterAll(async done => {
  app._connection.close()
  done()
})
