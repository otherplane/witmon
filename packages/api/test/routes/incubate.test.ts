import { test } from 'tap'
import {
  INCUBATION_COOLDOWN,
  INCUBATION_DURATION,
  INCUBATION_POINTS_OTHERS,
  INCUBATION_POINTS_SELF,
} from '../../src/constants'

import {
  claimEgg,
  server,
  initialEggs,
  sleep,
  INVALID_HEADER_TOKEN,
  VALID_HEADER_TOKEN_EGG_0,
} from './helper'

test('should return incubation object after incubate itself', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

  await new Promise((resolve) => {
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
        t.same(response.json().points, INCUBATION_POINTS_SELF)

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/eggs`,
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
        t.same(response.json()[0].score, INCUBATION_POINTS_SELF)

        t.end()

        resolve(true)
      }
    )
  })
})

test('should sum points to incubator and incubated', async (t) => {
  // Before test: Claim an egg
  const token0 = await claimEgg(t)(0)
  await claimEgg(t)(1)

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/eggs/incubate',
        payload: {
          target: initialEggs[1].key,
        },
        headers: {
          Authorization: `${token0}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
          )
        t.same(response.json().points, INCUBATION_POINTS_OTHERS)

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/eggs`,
        headers: {
          Authorization: `${token0}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8'
        )
        t.same(response.json()[0].score, 0)
        t.same(response.json()[1].score, INCUBATION_POINTS_OTHERS)

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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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

  await new Promise((resolve) => {
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
