import cors from '@fastify/cors'
import fastify from 'fastify'

import { env } from './env'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running')
})
