// // This file contains code that we reuse between our tests.
// import app from '../src/app'
// import * as tap from 'tap'

// export type Test = typeof tap['Test']['prototype']

// // Fill in this config with all the configurations
// // needed for testing the application
// async function config () {
//   return {}
// }

// // Automatically build and tear down our instance
// async function build (t: Test) {
//   console.log('-----------')
//   // fastify-plugin ensures that all decorators
//   // are exposed for testing purposes, this is
//   // different from the production setup

//   await app.ready()
//   try {
//     await app.mongo.db?.collection('eggs').drop()
//   } catch (err) {
//     console.log('Error dropping mongo')
//   }
//   // Tear down our app after we are done
//   t.teardown(() => void app.close())

//   return app
// }

// export { config, build }
