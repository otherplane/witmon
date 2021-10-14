import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EggMetadata, GetByKeyParams } from '../types'

const metadata: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: GetByKeyParams; Reply: EggMetadata | Error }>(
    '/metadata/:key',
    {
      schema: {
        params: GetByKeyParams,
        response: {
          200: EggMetadata,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: { key: string } }>,
        reply
      ) => {
        const sample: EggMetadata = {
          name: 'Witty Creature #77',
          description: 'Witty Creatures 2.0 at Liscon 2021. Powered by Witnet!',
          image_data:
            "<svg width='32' height='32' version='1.1' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><style>#witmon77 .a { fill: #d22f94; } #witmon77 .b { fill: #1c49d8; } #witmon77 .c { fill: #19b554; } #witmon77 .d { fill: #d22f94; }</style><rect width='32' height='32' class='a'/><path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/></svg>",
          external_url: 'https://wittycreatures.com/creatures/17',
          attributes: [
            {
              trait_type: 'Species',
              value: 'Witty',
            },
          ],
        }

        return reply.status(200).send(sample)
      },
    }
  )
}

export default metadata
