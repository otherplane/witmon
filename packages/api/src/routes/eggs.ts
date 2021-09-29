import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { GetByKeyParams } from '../types'
import { EggRepository } from '../repositories/egg'

const eggs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const repository = new EggRepository(fastify.mongo.db)

  fastify.get<{ Params: GetByKeyParams }>('/eggs/:key', {
    schema: {
      params: GetByKeyParams,
    },
    handler: async (
      request: FastifyRequest<{ Params: { key: string } }>,
      reply
    ) => {
      const { key } = request.params

      // const token = fastify.jwt.sign({ id: key })
      // console.log("Token:", token)

      // console.log("Decoded: ", fastify.jwt.verify(token))
      // console.log("Decoded wrong: ", fastify.jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2MzI4MzU3NjN9.jRQqyJssy9w7cWv6rQmIjfntX6t_cVUbSmhIo18cot9"))

      const egg = await repository.get(key)

      if (!egg) {
        return reply
          .status(404)
          .send(new Error(`Egg does not exist (key: ${key})`))
      }

      if (!egg.username) {
        return reply
          .status(405)
          .send(new Error(`Egg has not been claimed yet (key: ${key})`))
      }

      return reply.status(200).send({
        key: egg.key,
        username: egg.username,
        score: egg.score,
      })
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