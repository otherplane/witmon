import { test } from 'tap'
import { INCUBATION_POINTS } from '../../src/constants'

import { claimEgg, initialEggs, server } from './helper'

const VALID_ETH_ADDRESS = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
// Keccak256 digest for mint with VALID_ETH_ADDRESS and
// index 0, rank 1 and total eggs 2.
const MESSAGE_DIGEST =
  '4040cf85fcfd59bb0d329dda58b38cf537e48dee7b7b0a7af080ceef03a7858b'

const INVALID_ETH_ADDRESS_1 = '0x00'
const INVALID_ETH_ADDRESS_2 = 'foo'

test('should mint a claimed egg', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)
  await claimEgg(t)(1)

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[0].key,
        },
        headers: {
          Authorization: `${token}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )
        t.ok(response.json().envelopedSignature)
        t.ok(response.json().envelopedSignature.message)
        t.same(response.json().envelopedSignature.messageHash, MESSAGE_DIGEST)
        t.ok(response.json().envelopedSignature.signature)
        t.same(response.json().data, {
          address: VALID_ETH_ADDRESS,
          index: 0,
          rank: 1,
          score: INCUBATION_POINTS,
          total: 2,
        })
        console.log("--->", response.json())


        t.end()

        resolve(true)
      }
    )
  })
})

test('should NOT mint an egg with invalid address', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[0].key,
        },
        headers: {
          Authorization: `${token}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_1 },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 409)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_2 },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 409)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )

        t.end()

        resolve(true)
      }
    )
  })
})
