import { defineEventHandler, readBody, createError } from 'h3'
import {
  buildSignatureFilename,
  getAbsoluteBrandGifUrl,
  loadSignatureTemplate,
  normalizeSignaturePayload,
  renderSignatureHtml,
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

  let template = ''

  try {
    template = await loadSignatureTemplate()
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Template not found'
    })
  }

  const brandGifUrl = getAbsoluteBrandGifUrl(event)
  const html = renderSignatureHtml(template, signature, brandGifUrl)

  return {
    success: true,
    html,
    filename: buildSignatureFilename(signature.name),
    brandGifUrl
  }
})
