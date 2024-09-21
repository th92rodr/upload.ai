import { createReadStream } from 'node:fs'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { openai } from '../lib/openai'
import { prisma } from '../lib/prisma'

export const createTranscriptionRoute: FastifyPluginAsyncZod = async app => {
  app.route({
    method: 'POST',
    url: '/videos/:videoId/transcription',
    schema: {
      params: z.object({
        videoId: z.string().uuid(),
      }),
      body: z.object({
        prompt: z.string(),
      }),
    },
    handler: async request => {
      const { videoId } = request.params
      const { prompt } = request.body

      const video = await prisma.video.findUniqueOrThrow({
        where: { id: videoId },
      })

      const audioReadStream = createReadStream(video.path)

      const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'json',
        temperature: 0,
        prompt,
      })

      const transcription = response.text

      await prisma.video.update({
        where: { id: videoId },
        data: { transcription },
      })

      return { transcription }
    },
  })
}
