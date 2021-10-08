import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import keccak from 'keccak'
import secp256k1 from 'secp256k1'
import Web3 from 'web3'

import { EGG_BIRTH_DATE, MINT_PRIVATE_KEY } from '../constants'
import { EggRepository } from '../repositories/egg'
import { MintRepository } from '../repositories/mint'
import {
  AuthorizationHeader,
  JwtVerifyPayload,
  MintOutput,
  MintParams,
} from '../types'
import { fromHexToUint8Array, isTimeToMint } from '../utils'

const mint: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const eggRepository = new EggRepository(fastify.mongo.db)
  const mintRepository = new MintRepository(fastify.mongo.db)

  fastify.post<{ Body: MintParams; Reply: MintOutput | Error }>('/mint', {
    schema: {
      body: MintParams,
      headers: AuthorizationHeader,
      response: {
        200: MintOutput,
      },
    },
    handler: async (request: FastifyRequest<{ Body: MintParams }>, reply) => {
      // Check 0: incubation period
      if (EGG_BIRTH_DATE && isTimeToMint())
        return reply
          .status(403)
          .send(new Error(`Forbidden: mint is not enabled yet`))

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
      const egg = await eggRepository.get(fromId)
      if (!egg) {
        return reply
          .status(404)
          .send(new Error(`Egg does not exist (key: ${fromId})`))
      }

      // Check 3 (unreachable): incubating player egg has been claimed
      if (!egg.token) {
        return reply
          .status(409)
          .send(
            new Error(`Player egg should be claimed before incubating others`)
          )
      }

      // If previously minted, reply with same mint output
      const prevMint = await mintRepository.get(fromId)
      if (prevMint) {
        return reply.status(200).send(prevMint)
      }

      const web3 = new Web3()
      // Check address is valid
      if (!web3.utils.isAddress(request.body.address)) {
        return reply
          .status(409)
          .send(new Error(`Mint address should be a valid Ethereum addresss`))
      }

      // Build message to sign
      const rank = await eggRepository.calculateRarityIndex(egg)
      const total = await eggRepository.countClaimed()

      const message = web3.utils.encodePacked(
        request.body.address,
        egg.index,
        rank,
        total
      )

      if (!message) {
        throw Error('Mint failed because signature message is empty')
      }

      // Compute Keccak256 from data
      const messageBuffer = Buffer.from(message.substring(2), 'hex')
      const messageHash = keccak('keccak256').update(messageBuffer).digest()

      // Sign message
      // Note: web3.eth.accounts.sign is not used because it prefixes the message to sign
      const signatureObj = secp256k1.ecdsaSign(
        messageHash,
        fromHexToUint8Array(MINT_PRIVATE_KEY)
      )
      // `V` signature component (V = 27 + recid)
      const signV = (27 + signatureObj.recid).toString(16)
      // Signature = RS | V
      const signature = Buffer.from(signatureObj.signature)
        .toString('hex')
        .concat(signV)

      const response = {
        envelopedSignature: {
          message: message.substring(2),
          messageHash: messageHash.toString('hex'),
          signature,
        },
        data: {
          address: request.body.address,
          color: egg.color,
          index: egg.index,
          rank,
          score: egg.score,
          total,
        },
      }

      // Save mint output for future requests
      mintRepository.create(response)

      return reply.status(200).send(response)
    },
  })
}

export default mint
