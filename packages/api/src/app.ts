import Ajv from 'ajv'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastifyJwt from 'fastify-jwt'
import { FastifyPluginAsync } from 'fastify'
import { fastifyMongodb } from 'fastify-mongodb'
import { join } from 'path'

import { Egg } from './types'
import { EggRepository } from './repositories/egg'

require('dotenv').config()

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // // HTTPS support
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

    const repository = new EggRepository(fastify.mongo.db)

    const initalEggs: [Egg] = require('./eggs.json')
    try {
      const promises = initalEggs.map(async (egg: Egg) => {
        const isAlreadyCreated = await repository.get(egg.key)
        if (!isAlreadyCreated) {
          await repository.create(egg)
        }
      })
      await Promise.all(promises)
    } catch (error) {
      throw Error('could not create initial eggs in mongo db')
    }

    next()
  })

  // JWT
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
  })

  // Plugins defined in routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  })
}

export default app
export { app }
