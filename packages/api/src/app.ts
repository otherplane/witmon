import Ajv from 'ajv'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastifyJwt from 'fastify-jwt'
import { FastifyPluginAsync } from 'fastify'
import { fastifyMongodb } from 'fastify-mongodb'
import { join } from 'path'

import { JWT_SECRET } from './constants'
import { EggRepository } from './repositories/egg'

require('dotenv').config()

// Tell how many eggs to generate
const EGGS_COUNT = process.env.EGGS_COUNT
  ? parseInt(process.env.EGGS_COUNT)
  : 10

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // TODO: Add HTTPS support
  // {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
  //   }
  // }

  // Json Validator
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: 'array',
    allErrors: true,
  })
  // Support ajv@7
  ajv.addKeyword('kind')
  ajv.addKeyword('modifier')
  fastify.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema)
  })

  // MongoDB
  fastify.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    forceClose: true,
    url: process.env.MONGO_URI,
  })

  // Initialize egg repository from `eggs.json`
  fastify.register(async (fastify, options, next) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')

    // Initialize eggs repository and bootstrap with EGGS_COUNT eggs if no eggs exist already
    const repository = new EggRepository(fastify.mongo.db)
    await repository.bootstrap(EGGS_COUNT, false)

    next()
  })

  // CORS
  fastify.register(require('fastify-cors'), {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  // JWT
  fastify.register(fastifyJwt, {
    secret: JWT_SECRET as string,
  })

  // Plugins defined in routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  })

  fastify.register(require('fastify-static'), {
    root: join(__dirname, '../public'),
    // prefix: '/public/', // optional: default '/'
  })
}

export default app
export { app }
