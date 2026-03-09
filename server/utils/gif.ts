import puppeteer from 'puppeteer'
import GIFEncoder from 'gifencoder'
import { PNG } from 'pngjs'

interface RenderAnimatedGifOptions {
  html: string
  selector: string
  width: number
  height: number
  frameCount?: number
  frameDelay?: number
  quality?: number
  omitBackground?: boolean
}

async function openBrowser() {
  if (process.env.VERCEL) {
    const chromium = await import('@sparticuz/chromium').then((module) => module.default)
    const puppeteerCore = await import('puppeteer-core').then((module) => module.default)

    chromium.setGraphicsMode = false

    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    })
  }

  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  })
}

export async function renderAnimatedGif({
  html,
  selector,
  width,
  height,
  frameCount = 48,
  frameDelay = 50,
  quality = 1,
  omitBackground = false
}: RenderAnimatedGifOptions): Promise<Buffer> {
  const browser = await openBrowser()

  try {
    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const element = await page.$(selector)
    if (!element) {
      throw new Error(`Element not found for selector: ${selector}`)
    }

    await page.evaluate(() => {
      document.getAnimations().forEach((animation) => {
        animation.pause()
        animation.currentTime = 0
      })
    })

    const encoder = new GIFEncoder(width, height)
    const chunks: Buffer[] = []
    const stream = encoder.createReadStream()

    stream.on('data', (chunk: Buffer) => chunks.push(chunk))

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(frameDelay)
    encoder.setQuality(quality)

    for (let frame = 0; frame < frameCount; frame += 1) {
      const currentTime = frame * frameDelay

      await page.evaluate((time) => {
        document.getAnimations().forEach((animation) => {
          animation.currentTime = time
        })
      }, currentTime)

      const screenshot = await element.screenshot({
        encoding: 'binary',
        omitBackground
      })

      const pixels = await new Promise<Buffer>((resolve, reject) => {
        new PNG().parse(screenshot as Buffer, (error, data) => {
          if (error) {
            reject(error)
            return
          }

          resolve(data.data)
        })
      })

      const context = {
        getImageData: () => ({
          data: pixels,
          width,
          height
        })
      }

      encoder.addFrame(context as never)
    }

    const completed = new Promise<void>((resolve) => {
      stream.on('end', () => resolve())
    })

    encoder.finish()
    await completed

    return Buffer.concat(chunks)
  } finally {
    await browser.close()
  }
}
