import { test } from 'tap'

import { server } from './helper'

const initialEggs = [
  {
    key: 'ef12efbd765f9ad3',
    index: 0,
    username: 'calm-bison',
    score: 0,
  },
]

test('should claim EGG #0', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/claim',
      payload: { key: initialEggs[0].key },
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

test('should NOT claim EGG #12345 - does not exist', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/claim',
      payload: { key: '12345' },
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

test('should NOT claim EGG #1 - twice', async (t) => {

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
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )
        t.ok(response.json().token)
        t.ok(response.json().username)
        t.same(response.json().key, initalEggs[0].key)
        t.same(response.json().score, 0)
        
        resolve(true)
      }
    )
  })

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/claim',
        payload: { key: '1' },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 405)
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