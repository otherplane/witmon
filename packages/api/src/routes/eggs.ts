import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EggRepository } from '../repositories/egg'
import { IncubationRepository } from '../repositories/incubation'
import {
  AuthorizationHeader,
  EggProtected,
  ExtendedEgg,
  GetByKeyParams,
  Incubation,
  IndexedEgg,
  JwtVerifyPayload,
} from '../types'
import { getIncubationExtendedFromBase } from '../utils'

const eggs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const eggRepository = new EggRepository(fastify.mongo.db)
  const incubationRepository = new IncubationRepository(fastify.mongo.db)

  fastify.get<{ Params: GetByKeyParams; Reply: ExtendedEgg | Error }>(
    '/eggs/:key',
    {
      schema: {
        params: GetByKeyParams,
        headers: AuthorizationHeader,
        response: {
          200: ExtendedEgg,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: { key: string } }>,
        reply
      ) => {
        const { key } = request.params

        let eggId: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          eggId = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        if (eggId !== key)
          return reply.status(403).send(new Error(`Forbidden: invalid token`))

        // Unreachable: valid server issued token refers to non-existent egg
        const egg = await eggRepository.get(key)
        if (!egg) {
          return reply
            .status(404)
            .send(new Error(`Egg does not exist (key: ${key})`))
        }

        // Unreachable: valid server issued token refers to an unclaimed egg
        if (!egg.token) {
          return reply
            .status(405)
            .send(new Error(`Egg has not been claimed yet (key: ${key})`))
        }

        // Get last ongoing incubations
        const incubatedByLast = await incubationRepository.getLast({
          to: egg.username,
        })
        const incubatingLast = await incubationRepository.getLast({
          from: egg.username,
        })

        const isIncubationActive = (incubation: Incubation) =>
          incubation.ends > Date.now()

        const incubatedBy =
          incubatedByLast && isIncubationActive(incubatedByLast)
            ? getIncubationExtendedFromBase(incubatedByLast)
            : undefined
        const incubating =
          incubatingLast && isIncubationActive(incubatingLast)
            ? getIncubationExtendedFromBase(incubatingLast)
            : undefined
        const extendedEgg: ExtendedEgg = {
          egg: {
            key: egg.key,
            index: egg.index,
            username: egg.username,
            score: egg.score,
            rarityIndex: await eggRepository.calculateRarityIndex(egg),
          },
          incubatedBy,
          incubating,
        }

        return reply.status(200).send(extendedEgg)
      },
    }
  )

  fastify.get<{ Reply: Array<EggProtected> | Error }>('/eggs', {
    schema: {
      headers: AuthorizationHeader,
    },
    handler: async (request, reply) => {
      // Verify token
      let idFromToken: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        idFromToken = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }

      // Unreachable: valid server issued token refers to non-existent egg
      const eggFromToken = await eggRepository.get(idFromToken)
      if (!eggFromToken) {
        return reply
          .status(404)
          .send(new Error(`Egg does not exist (key: ${idFromToken})`))
      }

      const eggsDocument: Array<IndexedEgg> = await eggRepository.list()

      const eggs = eggsDocument.map((egg) => {
        const eggSafe: EggProtected = {
          index: egg.index,
          username: egg.username,
          score: egg.score,
          rarityIndex: egg.rarityIndex,
        }

        return eggSafe
      })

      return reply.status(200).send(eggs)
    },
  })
}

export default eggs
