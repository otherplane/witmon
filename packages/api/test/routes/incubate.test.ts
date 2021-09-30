import { test } from 'tap'

import { claimEgg, server, initialEggs, sleep } from './helper'

const VALID_HEADER_TOKEN_EGG_0 = {
  Authorization:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
}
// const VALID_HEADER_TOKEN_EGG_NON_EXISTENT = {
//   Authorization:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNjMyOTE4MDA5fQ.kzORJoQhRdB0l7kKgN7nL2-E_gTfFr69C0uS6-CF8Tk',
// }
const INVALID_HEADER_TOKEN = {
  Authorization: 'foo',
}

// TODO: use constants.ts
const INCUBATION_DURATION = process.env.INCUBATION_DURATION
  ? parseInt(process.env.INCUBATION_DURATION)
  : 5 * 60 * 1000
const INCUBATION_COOLDOWN = process.env.INCUBATION_COOLDOWN
  ? parseInt(process.env.INCUBATION_COOLDOWN)
  : 2 * 60 * 60 * 1000

test('should return incubation object after incubate itself', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

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
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )
        t.same(response.json().to, initialEggs[0].key)
        t.same(response.json().from, initialEggs[0].key)
        t.ok(response.json().timestamp)
        console.log('INCUBATION_DURATION test: ', INCUBATION_DURATION)
        t.same(
          response.json().ends,
          response.json().timestamp + INCUBATION_DURATION
        )
        t.same(response.json().points, 20)

        t.end()

        resolve(true)
      }
    )
  })
})

test('should NOT incubate EGGs if invalid token (check 1)', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/eggs/incubate',
      payload: {
        target: initialEggs[0].key,
      },
      headers: INVALID_HEADER_TOKEN,
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

test('should NOT incubate EGGs if valid token but for non existent egg (check 2)', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/eggs/incubate',
      payload: {
        target: initialEggs[0].key,
      },
      headers: INVALID_HEADER_TOKEN,
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

test('should NOT incubate EGGs if incubating player has not claimed its own egg (check 3)', (t) => {
  server.inject(
    {
      method: 'POST',
      url: '/eggs/incubate',
      payload: {
        target: initialEggs[0].key,
      },
      headers: VALID_HEADER_TOKEN_EGG_0,
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 409)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.end()
    }
  )
})

test('should NOT incubate EGGs if target egg does not exist (check 4)', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: 'foo-bar',
        },
        headers: {
          Authorization: `${token}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 404)
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

test('should NOT incubate EGGs if target egg does not exist (check 5)', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
        },
        headers: {
          Authorization: `${token}`,
        },
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

test('should NOT incubate EGGs if is already incubating another egg (check 6)', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

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

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
        },
        headers: {
          Authorization: `${token}`,
        },
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

test('should NOT incubate EGGs if target egg is already being incubated (check 7)', async (t) => {
  // Before test: Claim an egg
  const token1 = await claimEgg(t)(0)
  const token2 = await claimEgg(t)(1)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[0].key,
        },
        headers: {
          Authorization: `${token1}`,
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

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[0].key,
        },
        headers: {
          Authorization: `${token2}`,
        },
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

test('should NOT incubate EGGs if cooldown has not elapsed (check 8)', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)
  await claimEgg(t)(1)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
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

  await sleep(INCUBATION_DURATION)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
        },
        headers: {
          Authorization: `${token}`,
        },
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

  await sleep(INCUBATION_COOLDOWN)

  await new Promise((resolve, reject) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
        },
        headers: {
          Authorization: `${token}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)

        t.end()

        resolve(true)
      }
    )
  })
})
