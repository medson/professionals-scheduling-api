
const app = require('../../application/app')
const req = require('supertest')
const { Professional, Schedule } = require('../../domain/models')
const ScheduleService = require('../../domain/services/ScheduleService')

describe('Schedules Controller integration', () => {
  beforeEach(async () => {
    await Professional.remove()
    await Schedule.remove()
  })

  it('it should be able to list all schedules', async () => {
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
      .get('/api/v1/schedule')

    expect(response.statusCode).toBe(200)
    expect(response.body[0].professional.name).toBe(professional.name)
    expect(response.body[0].professional.email).toBe(professional.email)
    expect(response.body[0]).toHaveProperty('_id')
    expect(response.body[0].monday.length).toBe(0)
    expect(response.body[0].tuesday.length).toBe(0)
    expect(response.body[0].wednesday.length).toBe(10)
    expect(response.body[0].thursday.length).toBe(0)
    expect(response.body[0].friday.length).toBe(10)
  })

  it('it should be able to create a new schedule', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }
    const newSchedule = {
      wednesday: ['08:30', '13:30'],
      friday: ['14:00', '19:00']
    }
    const professional = await Professional.create(newProfessional)
    const response = await req(app)
      .post(`/api/v1/professional/${professional.id}/schedule`)
      .send(newSchedule)

    expect(response.statusCode).toBe(201)
    expect(response.body.monday.length).toBe(0)
    expect(response.body.tuesday.length).toBe(0)
    expect(response.body.wednesday.length).toBe(10)
    expect(response.body.thursday.length).toBe(0)
    expect(response.body.friday.length).toBe(10)
    expect(response.body.professional).toBe(professional.id)
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
    expect(response.body).toHaveProperty('_id')
  })

  it('it should not be able to create a duplicated schedule', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }
    const professional = await Professional.create(newProfessional)
    await ScheduleService.create(professional.id, {
      wednesday: ['08:30', '13:30'],
      friday: ['14:00', '19:00']
    })

    const response = await req(app)
      .post(`/api/v1/professional/${professional.id}/schedule`)
      .send({
        wednesday: ['08:30', '13:30'],
        friday: ['14:00', '19:00']
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Already Exists')
  })

  it('it should not be able to create a new schedule with invalid id', async () => {
    const newSchedule = {
      wednesday: ['08:30', '13:30'],
      friday: ['14:00', '19:00']
    }

    const response = await req(app)
      .post('/api/v1/professional/000000000000000000000000/schedule')
      .send(newSchedule)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Professional not exists')
  })

  it('it should not be able to create a new schedule without one time available', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }

    const newSchedule = {
      wednesday: []
    }

    const professional = await Professional.create(newProfessional)

    const response = await req(app)
      .post(`/api/v1/professional/${professional.id}/schedule`)
      .send(newSchedule)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('size of array must be 2 `[hh:mm,hh:mm]`')
  })

  it('it should be able to update a schedule', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }
    const newSchedule = {
      wednesday: ['08:30', '13:30']
    }

    const professional = await Professional.create(newProfessional)
    const schedule = await Schedule.create({
      professional: professional.id,
      monday: ['11:00', '12:00'],
      tuesday: ['11:00', '12:00'],
      wednesday: ['11:00', '12:00']
    })
    const response = await req(app)
      .put(`/api/v1/professional/${professional.id}/schedule/${schedule.id}`)
      .send(newSchedule)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe(`schedule ${schedule.id} updated with success`)
  })

  it('it should not be able to update a schedule with non existent one', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }
    const newSchedule = {
      wednesday: ['08:30', '13:30']
    }

    const professional = await Professional.create(newProfessional)

    const response = await req(app)
      .put(`/api/v1/professional/${professional.id}/schedule/5f0ba12135162c001b3ad9fb`)
      .send(newSchedule)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('not found')
  })

  it('it should be able to delete a schedule', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })
    const schedule = await Schedule.create({
      professional: professional.id,
      monday: ['11:00', '12:00'],
      tuesday: ['11:00', '12:00'],
      wednesday: ['11:00', '12:00']
    })

    const response = await req(app)
      .delete(`/api/v1/professional/${professional.id}/schedule/${schedule.id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe(`schedule ${schedule.id} deleted with success`)
  })

  it('it should not be able to delete a schedule with invalid id', async () => {
    const professional = await Professional.create({
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    })

    const response = await req(app)
      .delete(`/api/v1/professional/${professional.id}/schedule/5f0ba12135162c001b3ad9fb`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('not found')
  })
})

afterAll(async done => {
  app._connection.close()
  done()
})
