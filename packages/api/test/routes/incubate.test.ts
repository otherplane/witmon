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

// const VALID_HEADER_TOKEN_EGG_0 = {
//   Authorization:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
// }
// const VALID_HEADER_TOKEN_EGG_12345 = {
//   Authorization:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNjMyOTE4MDA5fQ.kzORJoQhRdB0l7kKgN7nL2-E_gTfFr69C0uS6-CF8Tk',
// }
// const INVALID_HEADER_TOKEN = {
//   Authorization: 'foo',
// }

test('should return incubation object after incubate itself', async (t) => {
  let token: string

  // Before test: Claim an egg
  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/claim',
        payload: { key: initialEggs[0].key },
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
        console.log('response-------->', response.json())
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )

        t.same(response.json().to, initialEggs[0].key)
        t.same(response.json().from, initialEggs[0].key)
        t.ok(response.json().timestamp)
        t.same(response.json().ends, response.json().timestamp + 5 * 60 * 1000)
        t.same(response.json().points, 20)

        t.end()

        resolve(true)
      }
    )
  })
})
