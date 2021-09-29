import Fastify from 'fastify'
import app from './app'

const server = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
})

server
  .register(app)
  .then(() => server.ready())
  .then(() => server.listen(3000))
