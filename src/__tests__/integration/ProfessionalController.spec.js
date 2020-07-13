const app = require('../../application/app')
const req = require('supertest')
const api = req(app)
const { Professional, Schedule } = require('../../domain/models')

describe('Professionals Controller integration', () => {
  beforeEach(async () => {
    await Professional.remove()
    await Schedule.remove()
  })

  it('it should be able to list all professionals', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }
    await Professional.create(newProfessional)

    const response = await api
      .get('/api/v1/professional')

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].name).toBe(newProfessional.name)
    expect(response.body[0].email).toBe(newProfessional.email)
    expect(response.body[0]).toHaveProperty('createdAt')
    expect(response.body[0]).toHaveProperty('updatedAt')
    expect(response.body[0]).toHaveProperty('_id')
  })

  it('it should be able to create a professional', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }

    const response = await api
      .post('/api/v1/professional')
      .send(newProfessional)

    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProfessional.name)
    expect(response.body.email).toBe(newProfessional.email)
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
    expect(response.body).toHaveProperty('_id')
  })

  it('it should be able to create a professional with invalid email', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie.com'
    }

    const response = await api
      .post('/api/v1/professional')
      .send(newProfessional)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Bad Request')
    expect(response.body.message).toBe('"email" must be a valid email')
  })

  it('it should not be able to create duplicated professional', async () => {
    const newProfessional = {
      name: 'Jodie Whittaker',
      email: 'jodie@email.com'
    }

    await Professional.create(newProfessional)

    const response = await api
      .post('/api/v1/professional')
      .send(newProfessional)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Bad request')
  })
})

afterAll(async done => {
  app._connection.close()
  done()
})
