
const server = require('./application/app')
const settings = require('./application/settings')

server.listen(settings.port, () =>
  console.log(`Server is running on port ${settings.port}`)
)
