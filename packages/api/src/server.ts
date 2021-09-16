import { build } from './app'

const server = build({
  logger: {
    level: 'info',
    prettyPrint: true
  }
})

server.listen(3000, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})
