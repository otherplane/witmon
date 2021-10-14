import { test } from 'tap'

import { server } from './helper'

test('should get metadata for egg #77', async (t) => {
  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/metadata/77`,
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
})
