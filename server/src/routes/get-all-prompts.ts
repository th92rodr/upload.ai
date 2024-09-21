import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { prisma } from '../lib/prisma'

export const getAllPromptsRoute: FastifyPluginAsyncZod = async app => {
  app.route({
    method: 'GET',
    url: '/prompts',
    handler: async () => {
      const prompts = await prisma.prompt.findMany()
      return { prompts }
    },
  })
}
