import chromium from 'chrome-aws-lambda'

export default async function handler(req, res) {
  const { url } = req.query
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
  const page = await browser.newPage()
  await page.goto(url)
  await page.setViewport({
    width: 1920,
    height: 1080,
  })
  const content = await page.$('body')
  const imageBuffer = await content.screenshot({ omitBackground: true })
  await page.close()
  await browser.close()
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  )
  res.setHeader('Content-Type', 'image/png')
  res.send(imageBuffer)
  res.status(200)
}
