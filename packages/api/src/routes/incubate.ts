import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  EGG_MINT_TIMESSTAMP,
  INCUBATION_DURATION_MILLIS,
  INCUBATION_POINTS,
  INCUBATION_POINTS_DIVISOR,
  INCUBATION_POINTS_MIN,
} from '../constants'
import { EggRepository } from '../repositories/egg'
import { IncubationRepository } from '../repositories/incubation'
import {
  AuthorizationHeader,
  IncubateParams,
  Incubation,
  JwtVerifyPayload,
} from '../types'
import {
  calculateRemainingCooldown,
  isTimeToMint,
  printRemainingMillis,
} from '../utils'

const eggs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const eggRepository = new EggRepository(fastify.mongo.db)
  const incubationRepository = new IncubationRepository(fastify.mongo.db)

  fastify.post<{ Body: IncubateParams; Reply: Incubation | Error }>(
    '/eggs/incubate',
    {
      schema: {
        body: IncubateParams,
        headers: AuthorizationHeader,
        response: {
          200: Incubation,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: IncubateParams }>,
        reply
      ) => {
        // Check 0: incubation period
        if (EGG_MINT_TIMESSTAMP && isTimeToMint())
          return reply.status(403).send(new Error(`Incubation period is over.`))

        // Check 1: token is valid
        let fromId: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          fromId = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        // Check 2 (unreachable): valid server issued token refers to non-existent egg
        const fromEgg = await eggRepository.get(fromId)
        if (!fromEgg) {
          return reply
            .status(404)
            .send(new Error(`Egg does not exist (key: ${fromId})`))
        }

        // Check 3 (unreachable): incubating player egg has been claimed
        if (!fromEgg.token) {
          return reply
            .status(409)
            .send(
              new Error(`Player egg should be claimed before incubating others`)
            )
        }

        // Check 4: target egg exist
        const toEgg = await eggRepository.get(request.body.target)
        if (!toEgg) {
          return reply
            .status(404)
            .send(new Error(`Wrong target egg with key ${toEgg}`))
        }

        // Check 5: target egg is claimed
        if (!toEgg.token) {
          return reply
            .status(409)
            .send(new Error(`Target egg has not been claimed yet`))
        }

        const currentTimestamp = Date.now()

        // Check 6: incubator can incubate (is free)
        const incubatingLast = await incubationRepository.getLast({
          from: fromEgg.username,
        })
        if (incubatingLast && incubatingLast.ends > currentTimestamp) {
          return reply
            .status(409)
            .send(new Error(`Players can only incubate 1 egg at a time`))
        }

        // Check 7: target egg can be incubated (is free)
        const incubatedByLast = await incubationRepository.getLast({
          to: toEgg.username,
        })
        if (incubatedByLast && incubatedByLast.ends > currentTimestamp) {
          return reply
            .status(409)
            .send(new Error(`Target egg is already being incubated`))
        }

        // Check 8: cooldown period from incubator to target has elapsed
        const lastIncubation = await incubationRepository.getLast({
          from: fromEgg.username,
          to: toEgg.username,
        })
        const remainingCooldown: number = lastIncubation
          ? calculateRemainingCooldown(lastIncubation.ends)
          : 0
        if (remainingCooldown) {
          return reply
            .status(409)
            .send(
              new Error(
                `Target egg needs ${printRemainingMillis(
                  remainingCooldown
                )} to cooldown before being incubated again`
              )
            )
        }

        // Compute points:
        let points
        if (!lastIncubation) {
          points = INCUBATION_POINTS
        } else {
          points = Math.max(
            Math.ceil(lastIncubation.points / INCUBATION_POINTS_DIVISOR),
            INCUBATION_POINTS_MIN
          )
        }

        await eggRepository.addPoints(toEgg.key, points)

        // Create and return `incubation` object
        const incubation = await incubationRepository.create({
          ends: currentTimestamp + INCUBATION_DURATION_MILLIS,
          from: fromEgg.username,
          points,
          timestamp: currentTimestamp,
          to: toEgg.username,
        })

        return reply.status(200).send(incubation)
      },
    }
  )
}

export default eggs
