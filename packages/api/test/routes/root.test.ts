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

const VALID_HEADER_TOKEN_EGG_1 = {
  Authorization:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2MzI5MTY1Mzl9.UkFraLeHQgieKa7Od1K4oyGFQctWUZ7LY2TRAhb7C4Y',
}
const VALID_HEADER_TOKEN_EGG_12345 = {
  Authorization:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNjMyOTE4MDA5fQ.kzORJoQhRdB0l7kKgN7nL2-E_gTfFr69C0uS6-CF8Tk',
}
const INVALID_HEADER_TOKEN = {
  Authorization: 'foo',
}

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

test('should claim EGG #1', (t) => {
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

test('should NOT get EGG #1 - no authorization header', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 400)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

test('should NOT get EGG #1 - invalid jwt token', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/1',
      headers: {
        ...INVALID_HEADER_TOKEN,
        foo: 'bar',
      },
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 403)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

test('should NOT get EGG #12345 - valid token for EGG #1', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/12345',
      headers: VALID_HEADER_TOKEN_EGG_1,
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 403)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

test('should NOT get EGG #12345 - valid token but non-existent egg', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/12345',
      headers: VALID_HEADER_TOKEN_EGG_12345,
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

test('should NOT get EGG #1 - valid token but egg not claimed yet', (t) => {
  server.inject(
    {
      method: 'GET',
      url: '/eggs/1',
      headers: VALID_HEADER_TOKEN_EGG_1,
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

test('should get EGG #1 - first claim, then get', async (t) => {
  let token: string

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
        token = response.json().token

        resolve(true)
      }
    )
  })

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'GET',
        url: '/eggs/1',
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
        t.ok(response.json().username)
        t.same(response.json().score, 0)
        t.notOk(response.json().token)
        t.end()

        resolve(true)
      }
    )
  })
})

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
