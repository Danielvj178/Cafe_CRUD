require('dotenv').config({ path: 'config/.env' })

const Server = require('./models/server')

const server = new Server()
server.listen()
