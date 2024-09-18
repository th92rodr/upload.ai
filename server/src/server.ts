import cors from '@fastify/cors'
import fastify from 'fastify'

import { env } from './env'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(uploadVideoRoute)
app.register(getAllPromptsRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running')
})
