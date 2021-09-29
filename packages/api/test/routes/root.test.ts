import { test, beforeEach, before, teardown } from 'tap'
import { app } from '../../src/app'
import { Egg } from '../../src/types'
import Fastify from 'fastify'
import { FastifyInstance } from 'fastify/types/instance'
import { MongoClient } from 'mongodb'

const mongodb = require('mongodb')

const initalEggs: [Egg] = require('../../src/eggs.json')

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
  await client.db(process.env.MONGO_INITDB_DATABASE).collection('eggs').drop()

  server = Fastify().register(app)

  t.teardown(() => {
    server.close()
  })
})

// Claim EGG #1
test('POST `/claim/1` route', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/claim',
      payload: { key: '1' },
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.ok(response.json().token)
      t.ok(response.json().username)
      t.same(response.json().key, initalEggs[0].key)
      t.same(response.json().score, 0)
      t.end()
    }
  )
})

// GET EGG #12345 - non existent
test('GET `/eggs/1` route', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/12345',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

// GET EGG #1 - not claimed
test('GET `/eggs/1` route', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 405)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

// Claim EGG #1
test('POST `/claim/1` route', async (t) => {
  // Before test: Claim an egg
  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/claim',
        payload: { key: '1' },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)

        resolve(true)
      }
    )
  })

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'GET',
        url: '/eggs/1',
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )
        t.ok(response.json().username)
        t.same(response.json().score, 0)
        t.notOk(response.json().token)
        t.end()

        resolve(true)
      }
    )
  })
})

// // GET EGG #1 - claimed
// test('GET `/eggs/1` route', async t => {
//   t.plan(2)

//   server.inject(
//     {
//       method: 'POST',
//       url: '/claim',
//       payload: { key: "1" }
//     },
//     (err, response) => {
//       console.log("Response: ", response.json())
//       t.error(err)
//       t.equal(response.statusCode, 200)
//     }
//   )

//   // server.inject(
//   //   {
//   //     method: 'GET',
//   //     url: '/eggs/1'
//   //   },
//   //   (err, response) => {
//   //     console.log("Response: ", response.json())
//   //     t.error(err)
//   //     t.equal(response.statusCode, 200)
//   //     t.equal(
//   //       response.headers['content-type'],
//   //       'application/json; charset=utf-8'
//   //     )
//   //     // t.ok(response.json().username)
//   //     // t.same(response.json().score, 0)
//   //     // t.notOk(response.json().token)
//   //   }
//   // )
// })

// test('GET `/eggs` route', t => {
//   t.plan(4)

//   const fastify = build()

//   t.teardown(() => fastify.close())

//   fastify.inject(
//     {
//       method: 'GET',
//       url: '/eggs'
//     },
//     (err, response) => {
//       t.error(err)
//       t.equal(response.statusCode, 200)
//       t.equal(
//         response.headers['content-type'],
//         'application/json; charset=utf-8'
//       )
//       t.same(response.json(), initalEggs)
//     }
//   )
// })
