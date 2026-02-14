import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { name, role, email, phone, theme = 'dark' } = query

    if (!name || !role || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name, Role, and Email are required',
        })
    }

    // Read template from server assets
    const storage = useStorage('assets:server')
    let template = await storage.getItem('template.html') as string

    if (!template) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Template not found'
        })
    }

    // Replace placeholders
    // Using explicit string replacement to avoid regex issues with special chars in user input if not careful
    // But regex /g is needed for multiple occurrences. 
    // We'll stick to the proven regex pattern from previous files.
    template = template.replace(/Joao Silva/g, String(name))
    template = template.replace(/Analista/g, String(role))
    template = template.replace(/joao@ntl.com/g, String(email))

    if (phone) {
        const phoneHtml = `<p class="text-gray-600 font-normal text-sm leading-snug pt-0.5">${phone}</p>`
        template = template.replace('<!-- PHONE_PLACEHOLDER -->', phoneHtml)
    } else {
        template = template.replace('<!-- PHONE_PLACEHOLDER -->', '')
    }

    // Force Theme
    if (theme === 'dark') {
        // If template has body class="...", append dark. 
        // Assuming template starts with specific body tag or customizable.
        // Based on previous code:
        template = template.replace('<body class="', '<body class="dark ')
    }

    // Set headers to serve as HTML
    setHeader(event, 'Content-Type', 'text/html')

    return template
})
