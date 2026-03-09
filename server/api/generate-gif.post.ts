import { defineEventHandler, readBody, createError } from 'h3'
import { renderAnimatedGif } from '../utils/gif'
import {
  buildSignatureFilename,
  normalizeSignaturePayload,
  renderLegacySignatureGifDocument,
  signatureHasRequiredFields
} from '../utils/signature'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const signature = normalizeSignaturePayload(body ?? {})

  if (!signatureHasRequiredFields(signature)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, Role, and Email are required'
    })
  }

  const filename = buildSignatureFilename(signature.name).replace(/\.html$/, '.gif')
  const html = renderLegacySignatureGifDocument(signature)
  const buffer = await renderAnimatedGif({
    html,
    selector: '.signature-container',
    width: 620,
    height: 140,
    frameCount: 48,
    frameDelay: 50
  })

  return {
    success: true,
    dataUri: `data:image/gif;base64,${buffer.toString('base64')}`,
    filename
  }
})
