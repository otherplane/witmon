import { test } from 'tap'
import { build } from '../../src/app'

test('GET `/eggs` route', t => {
  t.plan(4)

  const fastify = build()

  t.teardown(() => fastify.close())

  fastify.inject(
    {
      method: 'GET',
      url: '/eggs'
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      )
      t.same(response.json(), [])
    }
  )
})
