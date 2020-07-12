const envPath = process.env.NODE_ENV
  ? `./.env.${process.env.NODE_ENV}`
  : './.env'

require('dotenv').config({ path: envPath })

const { env } = process

module.exports = {
  db: process.env.DB_HOST,
  port: env.PORT || 3000
}
