import { test } from 'tap'
import {
  INCUBATION_COOLDOWN_MILLIS,
  INCUBATION_DURATION_MILLIS,
} from '../../src/constants'

import {
  claimEgg,
  initialEggs,
  INVALID_HEADER_TOKEN,
  server,
  sleep,
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
        t.same(response.json().egg.color, initialEggs[0].color)
        t.same(response.json().egg.key, initialEggs[0].key)
        t.same(response.json().egg.index, initialEggs[0].index)
        t.same(response.json().egg.score, initialEggs[0].score)
        t.same(response.json().egg.username, initialEggs[0].username)
        t.same(response.json().egg.rarityIndex, 0)
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
  let color: number = initialEggs[0].color

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
        t.same(response.json(), [
          { index, color, username, score, rarityIndex: 0 },
        ])
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
        t.same(response.json().egg.rarityIndex, 0)

        // Check incubated by (self-incubation)
        t.same(response.json().incubatedBy.from, initialEggs[0].username)
        t.same(response.json().incubatedBy.to, initialEggs[0].username)
        t.ok(response.json().incubatedBy.remainingDuration > 0)
        t.ok(
          response.json().incubatedBy.remainingDuration <=
            INCUBATION_DURATION_MILLIS
        )
        t.ok(
          response.json().incubatedBy.remainingCooldown >
            INCUBATION_DURATION_MILLIS
        )
        t.ok(
          response.json().incubatedBy.remainingCooldown <=
            INCUBATION_DURATION_MILLIS + INCUBATION_COOLDOWN_MILLIS
        )

        // Check incubating (self-incubation)
        t.same(response.json().incubating.from, initialEggs[0].username)
        t.same(response.json().incubating.to, initialEggs[0].username)
        t.ok(response.json().incubating.remainingDuration > 0)
        t.ok(
          response.json().incubating.remainingDuration <=
            INCUBATION_DURATION_MILLIS
        )
        t.ok(
          response.json().incubating.remainingCooldown >
            INCUBATION_DURATION_MILLIS
        )
        t.ok(
          response.json().incubating.remainingCooldown <=
            INCUBATION_DURATION_MILLIS + INCUBATION_COOLDOWN_MILLIS
        )

        t.end()

        resolve(true)
      }
    )
  })
})

test('should return correct rarity index after incubate', async (t) => {
  // Before test: Claim an egg
  const token = await claimEgg(t)(0)
  const token2 = await claimEgg(t)(1)

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

  await sleep(INCUBATION_DURATION_MILLIS + INCUBATION_COOLDOWN_MILLIS)
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
        t.same(response.json()[0].rarityIndex, 0)
        t.same(response.json()[1].rarityIndex, 1)

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
        t.same(response.json().egg.rarityIndex, 0)

        resolve(true)
      }
    )
  })

  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/eggs/${initialEggs[1].key}`,
        headers: {
          Authorization: `${token2}`,
        },
      },
      (err, response) => {
        t.error(err)
        t.same(response.json().egg.rarityIndex, 1)
        t.end()

        resolve(true)
      }
    )
  })
})
