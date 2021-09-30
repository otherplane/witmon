import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EggRepository } from '../repositories/egg'
// import { IncubationRepository } from '../repositories/incubation'

import {
  AuthorizationHeader,
  ImproveParams,
  Incubation,
  JwtVerifyPayload,
} from '../types'

// const INCUBATION_DURATION = process.env.INCUBATION_DURATION
//   ? parseInt(process.env.INCUBATION_DURATION)
//   : 5 * 60 * 1000
// const INCUBATION_COOLDOWN = process.env.INCUBATION_COOLDOWN
//   ? parseInt(process.env.INCUBATION_COOLDOWN)
//   : 2 * 60 * 60 * 1000
// const INCUBATION_POINTS_SELF = process.env.INCUBATION_COOLDOWN
//   ? parseInt(process.env.INCUBATION_COOLDOWN)
//   : 20
// const INCUBATION_POINTS_OTHERS = process.env.INCUBATION_COOLDOWN
//   ? parseInt(process.env.INCUBATION_COOLDOWN)
//   : 100

const eggs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const eggRepository = new EggRepository(fastify.mongo.db)
  // const incubationRepository = new IncubationRepository(fastify.mongo.db)

  fastify.post<{ Body: ImproveParams; Reply: Incubation | Error }>(
    '/eggs/incubate',
    {
      schema: {
        body: ImproveParams,
        headers: AuthorizationHeader,
        response: {
          200: Incubation,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: ImproveParams }>,
        reply
      ) => {
        // Check 1: token is valid
        let eggId: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          eggId = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        // Check 2 (unreachable): valid server issued token refers to non-existent egg
        const tokenEgg = await eggRepository.get(eggId)
        if (!tokenEgg) {
          return reply
            .status(404)
            .send(new Error(`Egg does not exist (key: ${eggId})`))
        }

        // Check 3: target egg exist
        const target = await eggRepository.get(request.body.target)
        if (!target) {
          return reply
            .status(400)
            .send(new Error(`Wrong target egg with key ${target}`))
        }

        // Check 4: incubator can incubate (is free)

        // Check 5: target egg can be incubated (is free)

        // Check 6: cooldown period from incubator to target hass elapsed

        // Compute points:
        //  - if (incubator == target) --> 20
        //  - if (incubator != target) --> 100

        // Create and return `incubation` object

        // // Check if incubated is being incubated right now
        // if (Date.now() < incubated.lastTimeImproved + IMPROVE_PERIOD) {
        //   const lastImprovedByIncubator = incubated.improvedBy
        //     .filter((egg) => egg.key === incubator.key)
        //     .sort((egg1, egg2) => {
        //       return egg2.timestamp - egg1.timestamp
        //     })[0]

        //   if (
        //     !lastImprovedByIncubator ||
        //     Date.now() < lastImprovedByIncubator.timestamp + DELAY_TO_IMPROVE
        //   ) {
        //     repository.improve(incubated.key, incubator.key)
        //   } else {
        //     return reply
        //       .status(401)
        //       .send(
        //         new Error(
        //           `Egg ${incubated.key} has to wait to incubate this egg again`
        //         )
        //       )
        //   }
        // } else {
        //   return reply
        //     .status(401)
        //     .send(
        //       new Error(`Egg ${incubated.key} is being incubated right now`)
        //     )
        // }
      },
    }
  )
}

export default eggs
