import Fastify, { FastifyRequest } from 'fastify'
import { fastifyMongodb } from 'fastify-mongodb'
import Ajv from 'ajv'

import { EggRepository } from './repositories/egg'
import {
  Egg,
  EggInput,
  GetByKeyParams,
  ImproveInput,
  ListEggsQueryString
} from './types'

require('dotenv').config()

const DELAY_TO_IMPROVE = 3600000
const IMPROVE_PERIOD = 60000

export function build (opts = {}) {
  const fastify = Fastify(opts)
  // {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
  //   }
  // }
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: 'array',
    allErrors: true
  })
  // Support ajv@7
  ajv.addKeyword('kind')
  ajv.addKeyword('modifier')

  fastify.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema)
  })

  fastify.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    forceClose: true,
    url: process.env.MONGO_URI
  })

  fastify.register((fastify, options, next) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')
    const repository = new EggRepository(fastify.mongo.db)

    fastify.get<{ Querystring: ListEggsQueryString }>('/eggs', {
      schema: {
        querystring: ListEggsQueryString
      },
      handler: async (
        request: FastifyRequest<{ Querystring: ListEggsQueryString }>
      ) => {
        const { keys } = request.query

        return repository.list(keys)
      }
    })

    fastify.get<{ Params: GetByKeyParams }>('/eggs/:key', {
      schema: {
        querystring: GetByKeyParams
      },
      handler: async (request: FastifyRequest<{ Params: { key: string } }>) => {
        const { key } = request.params

        return await repository.get(key)
      }
    })

    fastify.post<{ Body: EggInput; Reply: Egg | Error }>('/eggs', {
      schema: {
        body: EggInput,
        response: {
          200: Egg
        }
      },
      handler: async (request: FastifyRequest<{ Body: EggInput }>, reply) => {
        const egg: Egg = {
          ...request.body,
          score: 0,
          improvedBy: [],
          lastTimeImproved: 0
        }
        try {
          return await repository.create(egg)
        } catch (error) {
          reply.status(409).send(error as Error)
        }
      }
    })

    fastify.post<{ Body: ImproveInput; Reply: Egg | Error }>('/eggs/improve', {
      schema: {
        body: ImproveInput,
        response: {
          200: Egg
        }
      },
      handler: async (
        request: FastifyRequest<{ Body: ImproveInput }>,
        reply
      ) => {
        const incubated = await repository.get(request.body.incubated)
        const incubator = await repository.get(request.body.incubator)

        if (!incubated) {
          return reply
            .status(400)
            .send(
              new Error(
                `Wrong incubated egg with key ${request.body.incubated}`
              )
            )
        }

        if (!incubator) {
          return reply
            .status(400)
            .send(
              new Error(
                `Wrong incubator egg with key ${request.body.incubator}`
              )
            )
        }

        // Check if incubated is being incubated right now
        if (Date.now() < incubated.lastTimeImproved + IMPROVE_PERIOD) {
          const lastImprovedByIncubator = incubated.improvedBy
            .filter(egg => egg.key === incubator.key)
            .sort((egg1, egg2) => {
              return egg2.timestamp - egg1.timestamp
            })[0]

          if (
            !lastImprovedByIncubator ||
            Date.now() < lastImprovedByIncubator.timestamp + DELAY_TO_IMPROVE
          ) {
            repository.improve(incubated.key, incubator.key)
          } else {
            return reply
              .status(401)
              .send(
                new Error(
                  `Egg ${incubated.key} has to wait to incubate this egg again`
                )
              )
          }
        } else {
          return reply
            .status(401)
            .send(
              new Error(`Egg ${incubated.key} is being incubated right now`)
            )
        }
      }
    })

    next()
  })

  return fastify
}
