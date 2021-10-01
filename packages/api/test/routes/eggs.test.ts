import { test } from 'tap'
import { INCUBATION_COOLDOWN, INCUBATION_DURATION } from '../../src/constants'

import {
  claimEgg,
  initialEggs,
  INVALID_HEADER_TOKEN,
  server,
  VALID_HEADER_TOKEN_EGG_0,
  VALID_HEADER_TOKEN_EGG_12345,
} from './helper'

test('should NOT get EGG #1 - no authorization header', (t) => {
  server.inject(
    {
      method: 'GET',
      url: `/eggs/${initialEggs[0].key}`,
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
      url: `/eggs/${initialEggs[0].key}`,
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
      headers: VALID_HEADER_TOKEN_EGG_0,
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
      url: `/eggs/${initialEggs[0].key}`,
      headers: VALID_HEADER_TOKEN_EGG_0,
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

test('should get EGG #1 - get after claimed', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/eggs/${initialEggs[0].key}`,
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
        t.same(response.json().egg.key, initialEggs[0].key)
        t.same(response.json().egg.index, initialEggs[0].index)
        t.same(response.json().egg.score, initialEggs[0].score)
        t.same(response.json().egg.username, initialEggs[0].username)
        t.notOk(response.json().incubating)
        t.notOk(response.json().incubatedBy)
        t.notOk(response.json().egg.token)
        t.end()

        resolve(true)
      }
    )
  })
})

test('should list EGGs - list after claiming', async (t) => {
  let username: string = initialEggs[0].username
  let index: number = initialEggs[0].index
  let score: number = initialEggs[0].index

  // Before test: Claim an egg
  const token = await claimEgg(t)(0)

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
        t.same(response.json(), [{ index, username, score }])
        t.notOk(response.json()[0].token)
        t.notOk(response.json()[0].key)
        t.end()

        resolve(true)
      }
    )
  })
})

test('should NOT list EGGs - invalid token', (t) => {
  server.inject(
    {
      method: 'GET',
      url: `/eggs`,
      headers: {
        Authorization: `${INVALID_HEADER_TOKEN}`,
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

test('should NOT list EGGs - valid token but non-existent egg', (t) => {
  server.inject(
    {
      method: 'GET',
      url: `/eggs`,
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

test('should get EGG #1 - get after incubation', async (t) => {
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
        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/eggs/${initialEggs[0].key}`,
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
        t.ok(response.json().incubating)
        t.ok(response.json().incubatedBy)
        t.ok(response.json().egg)

        // Check incubated by (self-incubation)
        t.same(response.json().incubatedBy.from, initialEggs[0].key)
        t.same(response.json().incubatedBy.to, initialEggs[0].key)
        t.ok(response.json().incubatedBy.remainingDuration > 0)
        t.ok(
          response.json().incubatedBy.remainingDuration <= INCUBATION_DURATION
        )
        t.ok(
          response.json().incubatedBy.remainingCooldown > INCUBATION_DURATION
        )
        t.ok(
          response.json().incubatedBy.remainingCooldown <=
            INCUBATION_DURATION + INCUBATION_COOLDOWN
        )

        // Check incubating (self-incubation)
        t.same(response.json().incubating.from, initialEggs[0].key)
        t.same(response.json().incubating.to, initialEggs[0].key)
        t.ok(response.json().incubating.remainingDuration > 0)
        t.ok(
          response.json().incubating.remainingDuration <= INCUBATION_DURATION
        )
        t.ok(response.json().incubating.remainingCooldown > INCUBATION_DURATION)
        t.ok(
          response.json().incubating.remainingCooldown <=
            INCUBATION_DURATION + INCUBATION_COOLDOWN
        )

        t.end()

        resolve(true)
      }
    )
  })
})
