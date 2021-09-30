import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EggRepository } from '../repositories/egg'
import { IncubationRepository } from '../repositories/incubation'

import {
  AuthorizationHeader,
  Egg,
  EggProtected,
  ExtendedEgg,
  GetByKeyParams,
  JwtVerifyPayload,
} from '../types'

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
          to: eggId,
        })
        const incubatingLast = await incubationRepository.getLast({
          from: eggId,
        })
        const incubatedBy =
          incubatedByLast && incubatedByLast.ends > Date.now()
            ? incubatedByLast
            : undefined
        const incubating =
          incubatingLast && incubatingLast.ends > Date.now()
            ? incubatingLast
            : undefined

        const extendedEgg: ExtendedEgg = {
          egg: {
            key: egg.key,
            index: egg.index,
            username: egg.username,
            score: egg.score,
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

      const eggsDocument: Array<Egg> = await eggRepository.list()

      const eggs = eggsDocument.map((egg) => {
        const eggSafe: EggProtected = {
          index: egg.index,
          username: egg.username,
          score: egg.score,
        }

        return eggSafe
      })

      return reply.status(200).send(eggs)
    },
  })
}

export default eggs

// fastify.post<{ Body: ImproveInput; Reply: Egg | Error }>('/eggs/improve', {
//   schema: {
//     body: ImproveInput,
//     response: {
//       200: Egg
//     }
//   },
//   handler: async (
//     request: FastifyRequest<{ Body: ImproveInput }>,
//     reply
//   ) => {
//     const incubated = await repository.get(request.body.incubated)
//     const incubator = await repository.get(request.body.incubator)

//     if (!incubated) {
//       return reply
//         .status(400)
//         .send(
//           new Error(
//             `Wrong incubated egg with key ${request.body.incubated}`
//           )
//         )
//     }

//     if (!incubator) {
//       return reply
//         .status(400)
//         .send(
//           new Error(
//             `Wrong incubator egg with key ${request.body.incubator}`
//           )
//         )
//     }

//     // Check if incubated is being incubated right now
//     if (Date.now() < incubated.lastTimeImproved + IMPROVE_PERIOD) {
//       const lastImprovedByIncubator = incubated.improvedBy
//         .filter(egg => egg.key === incubator.key)
//         .sort((egg1, egg2) => {
//           return egg2.timestamp - egg1.timestamp
//         })[0]

//       if (
//         !lastImprovedByIncubator ||
//         Date.now() < lastImprovedByIncubator.timestamp + DELAY_TO_IMPROVE
//       ) {
//         repository.improve(incubated.key, incubator.key)
//       } else {
//         return reply
//           .status(401)
//           .send(
//             new Error(
//               `Egg ${incubated.key} has to wait to incubate this egg again`
//             )
//           )
//       }
//     } else {
//       return reply
//         .status(401)
//         .send(
//           new Error(`Egg ${incubated.key} is being incubated right now`)
//         )
//     }
//   }
// })
