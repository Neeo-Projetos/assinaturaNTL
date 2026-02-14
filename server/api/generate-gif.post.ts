import { defineEventHandler, readBody, createError } from 'h3'
import fs from 'fs/promises'
import { join } from 'path'
import puppeteer from 'puppeteer'
import GIFEncoder from 'gifencoder'
import { PNG } from 'pngjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, role, email, phone, theme = 'dark' } = body

    if (!name || !role || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name, Role, and Email are required',
        })
    }

    // 1. Read Template
    const templatePath = join(process.cwd(), 'template.html')
    let template = await fs.readFile(templatePath, 'utf-8')

    // 2. Replace Placeholders
    template = template.replace(/Joao Silva/g, name)
    template = template.replace(/Analista/g, role)
    template = template.replace(/joao@ntl.com/g, email)

    if (phone) {
        const phoneHtml = `<p class="text-gray-600 font-normal text-sm leading-snug pt-0.5">${phone}</p>`
        template = template.replace('<!-- PHONE_PLACEHOLDER -->', phoneHtml)
    } else {
        template = template.replace('<!-- PHONE_PLACEHOLDER -->', '')
    }

    // Force Theme
    if (theme === 'dark') {
        template = template.replace('<body class="', '<body class="dark ')
    }

    // 3. Setup Output
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '')
    const filename = `assinatura${safeName}.gif`
    const publicDir = join(process.cwd(), 'public', 'assinaturas')
    const outputPath = join(publicDir, filename)

    // Ensure directory exists
    try {
        await fs.access(publicDir)
    } catch {
        await fs.mkdir(publicDir, { recursive: true })
    }

    // 4. Puppeteer & GIF Generation
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    })

    const page = await browser.newPage()

    // Set Viewport to desired signature size
    const width = 587
    const height = 140
    await page.setViewport({ width, height, deviceScaleFactor: 1 })

    await page.setContent(template, {
        waitUntil: 'networkidle0'
    })

    const element = await page.$('.signature-container')
    if (!element) {
        await browser.close()
        throw createError({ statusCode: 500, statusMessage: 'Signature container not found' })
    }

    const encoder = new GIFEncoder(width, height)

    // We need the standard fs for createWriteStream
    const { createWriteStream } = await import('fs')
    encoder.createReadStream().pipe(createWriteStream(outputPath))

    encoder.start()
    encoder.setRepeat(0)   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100)  // 100ms frame delay
    encoder.setQuality(10) // 10 is default

    // Capture Frames
    const frames = 30 // 3 seconds @ 10fps

    for (let i = 0; i < frames; i++) {
        // Screenshot element to buffer
        const buffer = await element.screenshot({
            encoding: 'binary',
            omitBackground: true
        })

        // Decode PNG buffer to raw pixels
        const pixels = await new Promise<Buffer>((resolve, reject) => {
            new PNG().parse(buffer as Buffer, (error, data) => {
                if (error) reject(error)
                else resolve(data.data)
            })
        })

        // Mock canvas context for gifencoder
        // gifencoder expects ctx.getImageData(0, 0, w, h).data
        const ctx: any = {
            getImageData: (_x: number, _y: number, _w: number, _h: number) => ({
                data: pixels,
                width,
                height
            })
        }

        encoder.addFrame(ctx)

        // Wait a bit for next frame
        await new Promise(r => setTimeout(r, 100))
    }

    encoder.finish()
    await browser.close()

    return {
        success: true,
        url: `/assinaturas/${filename}`
    }
})
