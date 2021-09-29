import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Egg, ClaimEggParams } from '../types'
import { EggRepository } from '../repositories/egg'

const claim: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const repository = new EggRepository(fastify.mongo.db)

  fastify.post<{ Body: ClaimEggParams; Reply: Egg | Error }>('/claim', {
    schema: {
      body: ClaimEggParams,
      response: {
        200: Egg,
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: ClaimEggParams }>,
      reply
    ) => {
      const key = request.body.key
      const egg = await repository.get(key)

      if (!egg) {
        return reply
          .status(404)
          .send(new Error(`Egg does not exist (key: ${key})`))
      }

      if (egg.token) {
        return reply
          .status(405)
          .send(new Error(`Egg has already been claimed (key ${key})`))
      }

      const token = fastify.jwt.sign({ id: key })

      try {
        return reply.status(200).send(
          await repository.update({
            ...egg,
            token,
          })
        )
      } catch (error) {
        reply.status(409).send(error as Error)
      }
    },
  })
}

export default claim
