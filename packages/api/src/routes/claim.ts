import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EGG_MINT_TIMESSTAMP } from '../constants'
import { EggRepository } from '../repositories/egg'
import { Egg, ClaimEggParams } from '../types'
import { isTimeToMint } from '../utils'

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
      // Check 0: check if game is over
      if (EGG_MINT_TIMESSTAMP && isTimeToMint())
        return reply.status(403).send(new Error(`Claiming is not posssible because the game is over.`))

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
