const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const settings = require('./settings')
const mongoose = require('mongoose')
const { errors } = require('celebrate')
const swaggerDocument = require('../../swagger.json')
const swaggerUi = require('swagger-ui-express')

class App {
  constructor () {
    this.express = express()
    this.database()
    this.setupMiddlewares()
    this.setupRoutes()
  }

  database () {
    mongoose.set('useFindAndModify', false)
    mongoose.connect(
      settings.db,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    this.express._connection = mongoose.connection
  }

  setupMiddlewares () {
    this.express.use(express.json())
    this.express.use(cors())
  }

  setupRoutes () {
    this.express.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    )
    this.express.use('/api/v1', routes)
    this.express.use(errors())
  }
}
module.exports = new App().express
