const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });

    const posterPath = path.resolve(__dirname, '..', 'poster.html');
    await page.goto(`file:///${posterPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.evaluate(() => {
        const source = document.querySelector('.poster');
        const pageOne = document.createElement('section');
        const pageTwo = document.createElement('section');
        pageOne.className = 'a4-page a4-page-one';
        pageTwo.className = 'a4-page a4-page-two';

        const cloneWithCanvasImages = (selector) => {
            const sourceElement = source.querySelector(selector);
            const clone = sourceElement.cloneNode(true);
            clone.querySelectorAll('canvas').forEach(canvas => {
                const originalCanvas = document.getElementById(canvas.id);
                const image = document.createElement('img');
                image.src = originalCanvas.toDataURL('image/png');
                image.className = canvas.className;
                image.width = canvas.width;
                image.height = canvas.height;
                image.style.cssText = getComputedStyle(canvas).cssText;
                canvas.replaceWith(image);
            });
            return clone;
        };

        pageOne.appendChild(cloneWithCanvasImages('.arcade-top'));
        pageOne.appendChild(cloneWithCanvasImages('.characters-section'));
        pageOne.appendChild(cloneWithCanvasImages('.powerups-section'));

        pageTwo.appendChild(cloneWithCanvasImages('.levels-section'));
        pageTwo.appendChild(source.querySelector('.qr-section').cloneNode(true));

        const style = document.createElement('style');
        style.textContent = `
            @page { size: A4 portrait; margin: 0; }
            html, body { margin: 0; padding: 0; background: #dedede; }
            body { display: block; font-family: 'Press Start 2P', monospace; }
            .poster { display: none !important; }
            .a4-pages { display: flex; flex-direction: column; gap: 16px; align-items: center; }
            .a4-page {
                width: 210mm;
                height: 297mm;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background:
                    radial-gradient(circle, rgba(45,27,105,0.05) 1.5px, transparent 1.5px) 0 0/22px 22px,
                    linear-gradient(180deg, #ffffff 0%, #fbfaff 50%, #ffffff 100%);
                border: 4px solid #2d1b69;
                padding: 22px 18px;
            }
            .a4-page .arcade-top { width: 100%; padding: 8px 12px 0; }
            .a4-page .title { font-size: 27px; line-height: 1.4; }
            .a4-page .wedding-line { font-size: 12px; margin-top: 8px; }
            .a4-page .characters-section { flex: 1; margin: 18px 0; padding: 18px 0; gap: 18px; }
            .a4-page .character-card { padding: 8px 4px; min-height: 0; }
            .a4-page .character-sprite { width: 100px; height: 150px; }
            .a4-page .char-name { font-size: 18px; }
            .a4-page .char-title { font-size: 11px; }
            .a4-page .heart-badge { width: 56px; height: 56px; }
            .a4-page .heart-big { font-size: 25px; }
            .a4-page .vs-text { font-size: 13px; }
            .a4-page .enemy-popup { width: 44px; height: 44px; }
            .a4-page .powerups-section { margin: 12px 0 8px; padding: 12px 8px 16px; }
            .a4-page .powerups-title { font-size: 17px; }
            .a4-page .level-loot { gap: 12px; }
            .a4-page .loot-item { font-size: 10px; }
            .a4-page .loot-item canvas, .a4-page .loot-item img { width: 36px; height: 36px; }
            .a4-page-two { justify-content: flex-start; gap: 22px; }
            .a4-page-two .levels-section { margin: 0; padding: 16px 14px 20px; }
            .a4-page-two .levels-title { font-size: 18px; margin-bottom: 12px; }
            .a4-page-two .levels-grid { gap: 10px; }
            .a4-page-two .level-card { padding: 18px 10px; }
            .a4-page-two .level-card .level-num { font-size: 13px; margin-bottom: 7px; }
            .a4-page-two .level-card .level-name { font-size: 15px; margin-bottom: 7px; }
            .a4-page-two .level-card .level-date { font-size: 12px; }
            .a4-page-two .qr-section { margin: auto 0 0; padding: 16px 20px 24px; }
            .a4-page-two .qr-label { font-size: 17px; }
            .a4-page-two .qr-code img { width: 130px; height: 130px; }
            .a4-page-two .qr-code { padding: 8px; }
            @media print {
                html, body { background: #ffffff; }
                .a4-pages { gap: 0; }
                .a4-page { page-break-after: always; }
                .a4-page:last-child { page-break-after: auto; }
            }
        `;
        document.head.appendChild(style);

        const pages = document.createElement('main');
        pages.className = 'a4-pages';
        pages.append(pageOne, pageTwo);
        document.body.appendChild(pages);
    });

    const pages = await page.$('.a4-pages');
    await pages.screenshot({
        path: path.resolve(__dirname, '..', 'poster-a4-preview.png'),
        type: 'png',
        omitBackground: false
    });
    await page.pdf({
        path: path.resolve(__dirname, '..', 'poster-a4.pdf'),
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });

    console.log('A4 preview saved to: poster-a4-preview.png');
    console.log('A4 two-page PDF saved to: poster-a4.pdf');
    await browser.close();
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
