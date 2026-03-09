import { defineEventHandler, getQuery, createError, setHeader } from 'h3'
import {
  getAbsoluteBrandGifUrl,
  loadSignatureTemplate,
  normalizeSignaturePayload,
  renderSignatureHtml,
  signatureHasRequiredFields
} from '../utils/signature'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const signature = normalizeSignaturePayload(query)

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

  setHeader(event, 'Content-Type', 'text/html')
  return renderSignatureHtml(template, signature, getAbsoluteBrandGifUrl(event))
})
