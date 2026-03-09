import type { H3Event } from 'h3'
import { getRequestURL } from 'h3'

export interface SignaturePayload {
  name?: string | null
  role?: string | null
  department?: string | null
  email?: string | null
  phone?: string | null
  phone1?: string | null
  phone2?: string | null
  phone3?: string | null
  whatsapp?: string | null
}

export interface NormalizedSignature {
  name: string
  role: string
  department: string
  email: string
  phone1: string
  phone2: string
  phone3: string
  whatsapp: string
}

const trimValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeAttribute = (value: string) => escapeHtml(value)

const replaceToken = (template: string, token: string, value: string) => template.split(token).join(value)

const sanitizePhoneHref = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  return trimmed.startsWith('+')
    ? `+${trimmed.slice(1).replace(/\D/g, '')}`
    : trimmed.replace(/\D/g, '')
}

const sanitizeWhatsAppHref = (value: string) => value.replace(/\D/g, '')

const renderLinkedText = (visibleText: string, href: string, color: string) =>
  `<a href="${href}" style="color:${color};text-decoration:none;border:0;outline:none;">${visibleText}</a>`

const renderPhoneLine = (phone: string) => {
  const visibleText = escapeHtml(phone)
  const href = sanitizePhoneHref(phone)

  if (!href) {
    return visibleText
  }

  return renderLinkedText(visibleText, `tel:${escapeAttribute(href)}`, '#1f2937')
}

const renderWhatsappLine = (whatsapp: string) => {
  const visibleText = `WhatsApp: ${escapeHtml(whatsapp)}`
  const href = sanitizeWhatsAppHref(whatsapp)

  if (!href) {
    return visibleText
  }

  return renderLinkedText(visibleText, `https://wa.me/${href}`, '#14804a')
}

const renderEmailLine = (email: string) =>
  renderLinkedText(escapeHtml(email), `mailto:${escapeAttribute(email)}`, '#0f4c81')

const renderLegacyContactLine = (html: string) => `<div class="contact-line">${html}</div>`

const renderRoleBlock = (role: string, department: string) => {
  const safeRole = escapeHtml(role)
  const safeDepartment = escapeHtml(department)

  if (!safeDepartment) {
    return `<div style="margin:0 0 14px 0;font-size:15px;line-height:1.5;color:#667085;">${safeRole}</div>`
  }

  return `<div style="margin:0 0 6px 0;font-size:15px;line-height:1.5;color:#667085;">${safeRole}</div><div style="margin:0 0 14px 0;font-size:14px;line-height:1.5;color:#8a93a1;">${safeDepartment}</div>`
}

const buildContactLines = (signature: NormalizedSignature) => {
  const contactLines = [signature.phone1, signature.phone2, signature.phone3].filter(Boolean).map(renderPhoneLine)

  if (signature.whatsapp) {
    contactLines.push(renderWhatsappLine(signature.whatsapp))
  }

  contactLines.push(renderEmailLine(signature.email))

  return contactLines
}

export function normalizeSignaturePayload(payload: SignaturePayload): NormalizedSignature {
  const fallbackPhone = trimValue(payload.phone)
  const phone1 = trimValue(payload.phone1) || fallbackPhone

  return {
    name: trimValue(payload.name),
    role: trimValue(payload.role),
    department: trimValue(payload.department),
    email: trimValue(payload.email),
    phone1,
    phone2: trimValue(payload.phone2),
    phone3: trimValue(payload.phone3),
    whatsapp: trimValue(payload.whatsapp)
  }
}

export function signatureHasRequiredFields(signature: NormalizedSignature) {
  return Boolean(signature.name && signature.role && signature.email)
}

export async function loadSignatureTemplate() {
  const storage = useStorage('assets:server')
  const template = (await storage.getItem('template.html')) as string | null

  if (!template) {
    throw new Error('Template not found')
  }

  return template
}

export function getAbsoluteBrandGifUrl(event: H3Event) {
  return new URL('/ntl.gif?v=20260309173500', getRequestURL(event)).toString()
}

export function buildSignatureFilename(name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '')
  return `assinatura${safeName || 'NTL'}.html`
}

export function renderSignatureHtml(template: string, signature: NormalizedSignature, brandGifUrl: string) {
  const contactBlock = buildContactLines(signature).join('<br />')

  const replacements: Array<[string, string]> = [
    ['{{NAME}}', escapeHtml(signature.name)],
    ['{{ROLE_BLOCK}}', renderRoleBlock(signature.role, signature.department)],
    ['{{CONTACT_BLOCK}}', contactBlock],
    ['{{GIF_URL}}', escapeAttribute(brandGifUrl)]
  ]

  return replacements.reduce((html, [token, value]) => replaceToken(html, token, value), template)
}

export function renderLegacySignatureGifDocument(signature: NormalizedSignature) {
  const contactLines = buildContactLines(signature).map(renderLegacyContactLine).join('')
  const departmentLine = signature.department
    ? `<div class="department">${escapeHtml(signature.department)}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Assinatura GIF NTL</title>
    <style>
      html, body {
        margin: 0;
        width: 620px;
        height: 140px;
        overflow: hidden;
        background: #ffffff;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
      }

      .signature-container {
        width: 620px;
        height: 140px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 22px;
        padding: 18px 24px;
        border: 1px solid #e5e7eb;
        background: #ffffff;
      }

      .text-panel {
        width: 360px;
      }

      .name {
        margin: 0 0 8px;
        font-size: 26px;
        line-height: 1.1;
        font-weight: 700;
        color: #111827;
      }

      .role {
        margin: 0 0 6px;
        font-size: 15px;
        line-height: 1.5;
        color: #5b6472;
      }

      .department {
        margin: 0 0 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #8a93a1;
      }

      .contact-line {
        margin: 0 0 6px;
        font-size: 14px;
        line-height: 1.4;
        color: #1f2937;
      }

      .contact-line a {
        text-decoration: none;
      }

      .divider {
        width: 1px;
        height: 82px;
        background: linear-gradient(180deg, #d6dbe4 0%, #f3f4f6 100%);
      }

      .brand-panel {
        width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
      }

      .brand-ring {
        width: 74px;
        height: 74px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        animation: pulse 2.8s ease-in-out infinite;
      }

      .brand-ring svg {
        width: 74px;
        height: 74px;
        animation: spinPause 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      .brand-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .brand-copy span {
        display: block;
        font-size: 23px;
        line-height: 1;
        letter-spacing: 0.24em;
        text-transform: lowercase;
        color: #707887;
        animation: drift 2.6s ease-in-out infinite;
      }

      .brand-copy span:last-child {
        animation-delay: 0.18s;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }

      @keyframes spinPause {
        0% { transform: rotate(0deg); }
        38% { transform: rotate(360deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes drift {
        0%, 100% { transform: translateX(0); opacity: 1; }
        50% { transform: translateX(4px); opacity: 0.86; }
      }
    </style>
  </head>
  <body>
    <div class="signature-container">
      <div class="text-panel">
        <h1 class="name">${escapeHtml(signature.name)}</h1>
        <p class="role">${escapeHtml(signature.role)}</p>
        ${departmentLine}
        ${contactLines}
      </div>
      <div class="divider"></div>
      <div class="brand-panel">
        <div class="brand-ring">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#808080" stroke-width="14"></circle>
            <text x="100" y="115" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="60" font-weight="700" fill="#808080" letter-spacing="2">ntl</text>
          </svg>
        </div>
        <div class="brand-copy">
          <span>nova</span>
          <span>tecnologia</span>
        </div>
      </div>
    </div>
  </body>
</html>`
}
