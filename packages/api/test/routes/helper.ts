// This file contains code that we reuse between our tests.
import { beforeEach, before, teardown } from 'tap'
import { app } from '../../src/app'
import Fastify from 'fastify'
import { FastifyInstance } from 'fastify/types/instance'
import { MongoClient } from 'mongodb'

const mongodb = require('mongodb')

let server: FastifyInstance
let client: MongoClient

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

export { server }
