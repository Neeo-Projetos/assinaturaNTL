import { defineEventHandler, readBody } from 'h3'
import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, role, email, phone } = body

  if (!name || !role || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, Role, and Email are required',
    })
  }

  // Read template (adjust path as needed, assuming it's in root of project)
  const templatePath = join(process.cwd(), 'template.html')
  let template = await fs.readFile(templatePath, 'utf-8')

  // Replace placeholders
  // We use regex to ensure we replace existing values from the specific template provided
  // 2. Replace Placeholders
  template = template.replace(/Joao Silva/g, name)
  template = template.replace(/Analista/g, role)
  template = template.replace(/joao@ntl.com/g, email)

  // Handle Phone (Optional)
  if (phone) {
    const phoneHtml = `<p class="text-gray-600 font-normal text-sm leading-snug pt-0.5">${phone}</p>`
    template = template.replace('<!-- PHONE_PLACEHOLDER -->', phoneHtml)
  } else {
    template = template.replace('<!-- PHONE_PLACEHOLDER -->', '')
  }

  // Generate filename: assinatura[Name].html
  // Remove spaces and special chars for filename
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '')
  const filename = `assinatura${safeName}.html`

  // Return HTML content directly (Stateless)
  return {
    success: true,
    html: template,
    filename: filename
  }
})
