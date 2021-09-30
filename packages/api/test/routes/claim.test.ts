import { test } from 'tap'

import { claimEgg, initialEggs, server } from './helper'

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
      t.same(response.json().key, initialEggs[0].key)
      t.same(response.json().index, initialEggs[0].index)
      t.same(response.json().score, initialEggs[0].score)
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

test('should NOT claim EGG #0 - twice', async (t) => {
  // Before test: Claim an egg
  await claimEgg(t)(0)

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/claim',
        payload: { key: initialEggs[0].key },
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
