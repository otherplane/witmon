import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { BootstrapParams } from '../types'
import { EggRepository } from '../repositories/egg'

const bootstrap: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const repository = new EggRepository(fastify.mongo.db)

  fastify.get<{ Params: BootstrapParams }>('/eggs/:key', {
    schema: {
      params: BootstrapParams,
    },
    handler: async (
      request: FastifyRequest<{ Params: BootstrapParams }>,
      reply
    ) => {
      // Read how many eggs to generate from the request parameters
      const { count } = request.params

      // Try to generate as many eggs as requested, return eggs on success, or error otherwise.
      try {
        const eggs = await repository.bootstrap(count)
        reply.status(200).send(eggs)
      } catch (e) {
        reply.status(500).send(e)
      }
    },
  })
}

export default bootstrap
