import { test } from 'tap'
import { Egg } from '../../src/types'

import { server } from './helper'

const initalEggs: [Egg] = require('../../src/eggs.json')

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