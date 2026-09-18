const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Poster CSS size is 1123x1587 (A3 @96dpi) + padding, captured at 3x scale (~300dpi)
    await page.setViewport({ width: 1163, height: 1627, deviceScaleFactor: 3 });
    
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

        const pdfPath = path.resolve(__dirname, '..', 'poster.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A3',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
        });
        console.log('Poster PDF saved to: ' + pdfPath);
    } else {
        console.error('Could not find .poster element');
    }
    
    await browser.close();
}

main().catch(console.error);
