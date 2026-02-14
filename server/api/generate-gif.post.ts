import { defineEventHandler, readBody, createError } from 'h3'
import puppeteer from 'puppeteer'
import GIFEncoder from 'gifencoder'
import { PNG } from 'pngjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, role, email, phone } = body

    if (!name || !role || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name, Role, and Email are required',
        })
    }

    // 1. Read Template from server assets
    const storage = useStorage('assets:server')
    let template = await storage.getItem('template.html') as string

    if (!template) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Template not found'
        })
    }

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

    // Force Theme to Light (do nothing, as default is light)
    // template = template.replace('<body class="', '<body class="dark ') // Removed

    // 3. Setup Filename
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '')
    const filename = `assinatura${safeName}.gif`

    // 4. Puppeteer & GIF Generation
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    })

    const page = await browser.newPage()

    // Set Viewport
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

    // --- DETERMINISTIC ANIMATION CONTROL ---
    // Pause all animations and reset to 0
    await page.evaluate(() => {
        document.getAnimations().forEach((anim) => {
            anim.pause();
            anim.currentTime = 0;
        });
    });

    const encoder = new GIFEncoder(width, height)

    const chunks: any[] = []
    const stream = encoder.createReadStream()
    stream.on('data', (chunk) => chunks.push(chunk))

    encoder.start()
    encoder.setRepeat(0)   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(33)   // 33ms frame delay (~30fps)
    encoder.setQuality(1)  // 1 is best quality

    // Capture Frames
    // Animation loop is roughly 3 seconds
    // 3s * 30fps = 90 frames
    const frames = 90

    for (let i = 0; i < frames; i++) {
        // Calculate exact time for this frame in milliseconds
        const time = i * 33;

        // Advance animation to specific time
        await page.evaluate((t) => {
            document.getAnimations().forEach((anim) => {
                anim.currentTime = t;
            });
        }, time);

        const buffer = await element.screenshot({
            encoding: 'binary',
            omitBackground: true
        })

        const pixels = await new Promise<Buffer>((resolve, reject) => {
            new PNG().parse(buffer as Buffer, (error, data) => {
                if (error) reject(error)
                else resolve(data.data)
            })
        })

        const ctx: any = {
            getImageData: (_x: number, _y: number, _w: number, _h: number) => ({
                data: pixels,
                width,
                height
            })
        }

        encoder.addFrame(ctx)

        // No need to wait anymore, we control time manually!
    }

    encoder.finish()
    await browser.close()

    const buffer = Buffer.concat(chunks)
    const base64 = buffer.toString('base64')
    const dataUri = `data:image/gif;base64,${base64}`

    return {
        success: true,
        dataUri: dataUri,
        filename: filename
    }
})
