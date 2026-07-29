const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport large enough for the poster (A3 ratio at 2x for print quality)
    await page.setViewport({ width: 1600, height: 2300, deviceScaleFactor: 2 });
    
    const posterPath = path.resolve(__dirname, '..', 'poster.html');
    await page.goto(`file:///${posterPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and QR code to render
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));
    
    // Screenshot just the poster element
    const poster = await page.$('.poster');
    if (poster) {
        const outputPath = path.resolve(__dirname, '..', 'poster.png');
        await poster.screenshot({ path: outputPath, type: 'png', omitBackground: true });
        console.log('Poster saved to: ' + outputPath);
    } else {
        console.error('Could not find .poster element');
    }
    
    await browser.close();
}

main().catch(console.error);
