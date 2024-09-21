import cors from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(cors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(uploadVideoRoute)
app.register(getAllPromptsRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running')
})
