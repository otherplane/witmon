import { skip } from 'tap'

import { server } from './helper'

// Note: this test requires WEB3_PROVIDER and a deployed WitmonERCC721 contract
skip('should get metadata for egg #1', async (t) => {
  await new Promise((resolve) => {
    server.inject(
      {
        method: 'GET',
        url: `/metadata/1`,
      },
      (err, response) => {
        t.error(err)
        t.equal(response.statusCode, 200)
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
