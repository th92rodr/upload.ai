import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { fastifyMultipart } from '@fastify/multipart'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { ClientError } from '../errors/client-error'
import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export const uploadVideoRoute: FastifyPluginAsyncZod = async app => {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, //25mb
    },
  })

  app.route({
    method: 'POST',
    url: '/videos',
    handler: async request => {
      const data = await request.file()

      if (!data) {
        throw new ClientError('Missing file input.')
      }

      const extension = path.extname(data.filename)

      if (extension !== '.mp3') {
        throw new ClientError('Invalid file input type.')
      }

      const fileBaseName = path.basename(data.filename, extension)
      const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
      const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

      await pump(data.file, createWriteStream(uploadDestination))

      const video = await prisma.video.create({
        data: {
          name: data.filename,
          path: uploadDestination,
        },
      })

      return { video }
    },
  })
}
