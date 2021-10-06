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
    color: 0,
    index: 0,
    key: 'ef12efbd765f9ad3',
    score: 0,
    username: 'calm-bison',
  },
  {
    color: 1,
    index: 1,
    key: 'b75c34545e8cb4d2',
    score: 0,
    username: 'particular-newt',
  },
]

export const VALID_HEADER_TOKEN_EGG_0 = {
  Authorization:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
}
export const VALID_HEADER_TOKEN_EGG_12345 = {
  Authorization:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNjMyOTE4MDA5fQ.kzORJoQhRdB0l7kKgN7nL2-E_gTfFr69C0uS6-CF8Tk',
}
export const INVALID_HEADER_TOKEN = {
  Authorization: 'foo',
}

before(async () => {
  await new Promise((resolve) => {
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
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, msec)
  })
}

function claimEgg(t: Tap.Test) {
  return async (index: number): Promise<string> =>
    new Promise((resolve) => {
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
