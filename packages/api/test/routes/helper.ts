// This file contains code that we reuse between our tests.
import { beforeEach, before, teardown } from 'tap'
import { app } from '../../src/app'
import Fastify from 'fastify'
import { FastifyInstance } from 'fastify/types/instance'
import { MongoClient } from 'mongodb'

const mongodb = require('mongodb')

let server: FastifyInstance
let client: MongoClient

const initialEggs = [
  {
    key: 'ef12efbd765f9ad3',
    index: 0,
    username: 'calm-bison',
    score: 0,
  },
  {
    key: 'b75c34545e8cb4d2',
    index: 1,
    username: 'particular-newt',
    score: 0,
  },
]

before(async () => {
  await new Promise((resolve, reject) => {
    mongodb.MongoClient.connect(process.env.MONGO_URI).then(
      async (dbClient: MongoClient) => {
        client = dbClient
        resolve(true)
      }
    )
  })
})

teardown(async () => {
  await client.close()
})

beforeEach(async (t) => {
  // Drop mongodb `eggs` collection
  // process.env.INCUBATION_COOLDOWN = "2000"
  // process.env.INCUBATION_DURATION = "2000"

  try {
    await client.db(process.env.MONGO_INITDB_DATABASE).collection('eggs').drop()
  } catch (err) {
    console.error('Error dropping mongo')
  }

  server = Fastify().register(app)

  t.teardown(() => {
    server.close()
  })
})

async function sleep(msec: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, msec)
  })
}

function claimEgg(t: Tap.Test) {
  return async (index: number): Promise<string> =>
    new Promise((resolve, reject) => {
      server.inject(
        {
          method: 'POST',
          url: '/claim',
          payload: { key: initialEggs[index].key },
        },
        (err, response) => {
          t.error(err)
          t.equal(response.statusCode, 200)

          resolve(response.json().token)
        }
      )
    })
}

export { server, claimEgg, initialEggs, sleep }
