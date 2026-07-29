const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 8091;
const ROOT = path.resolve(__dirname, '..');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    // Start local server
    console.log('Starting local server on port', PORT);
    const server = spawn('npx', ['http-server', ROOT, '-p', PORT, '-s', '--cors'], {
        shell: true,
        stdio: 'pipe'
    });
    await sleep(2000); // Wait for server to start

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // === SCREENSHOT 1: Game Title Screen ===
        console.log('Capturing title screen...');
        const gamePage = await browser.newPage();
        await gamePage.setViewport({ width: 960, height: 540, deviceScaleFactor: 2 });
        await gamePage.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });
        await sleep(3000); // Let Phaser boot and render title
        await gamePage.screenshot({ path: path.join(ROOT, 'screenshots', 'title-screen.png') });
        console.log('  -> title-screen.png');

        // === SCREENSHOT 2: Character Select ===
        console.log('Capturing character select...');
        // Click/tap to advance past title
        await gamePage.mouse.click(480, 270);
        await sleep(2000);
        await gamePage.screenshot({ path: path.join(ROOT, 'screenshots', 'character-select.png') });
        console.log('  -> character-select.png');

        // === SCREENSHOT 3: Gameplay (Zanuff) ===
        console.log('Capturing gameplay (Zanuff)...');
        // Click left side (Zanuff card area)
        await gamePage.mouse.click(320, 270);
        await sleep(4000); // Let story/transition play then game starts
        // Click through story scene
        await gamePage.mouse.click(480, 270);
        await sleep(2000);
        await gamePage.mouse.click(480, 270);
        await sleep(3000);
        await gamePage.screenshot({ path: path.join(ROOT, 'screenshots', 'gameplay-zanuff.png') });
        console.log('  -> gameplay-zanuff.png');

        // === SCREENSHOT 4: Gameplay after some time ===
        console.log('Waiting for gameplay action...');
        await sleep(5000);
        await gamePage.screenshot({ path: path.join(ROOT, 'screenshots', 'gameplay-action.png') });
        console.log('  -> gameplay-action.png');

        await gamePage.close();

        // === SCREENSHOT 5: Marabeige gameplay ===
        console.log('Capturing Marabeige gameplay...');
        const gamePage2 = await browser.newPage();
        await gamePage2.setViewport({ width: 960, height: 540, deviceScaleFactor: 2 });
        await gamePage2.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });
        await sleep(3000);
        await gamePage2.mouse.click(480, 270); // Past title
        await sleep(2000);
        await gamePage2.mouse.click(640, 270); // Right side (Marabeige)
        await sleep(4000);
        await gamePage2.mouse.click(480, 270); // Story
        await sleep(2000);
        await gamePage2.mouse.click(480, 270);
        await sleep(4000);
        await gamePage2.screenshot({ path: path.join(ROOT, 'screenshots', 'gameplay-marabeige.png') });
        console.log('  -> gameplay-marabeige.png');
        await gamePage2.close();

        // === POSTER PNG (high resolution for A3 print) ===
        console.log('Capturing poster as PNG...');
        const posterPage = await browser.newPage();
        // A3 at 150 DPI = 1754x2480. We use the poster's CSS size with 3x scale
        await posterPage.setViewport({ width: 834, height: 1163, deviceScaleFactor: 3 });
        await posterPage.goto(`http://localhost:${PORT}/poster.html`, { waitUntil: 'networkidle0', timeout: 30000 });
        await sleep(5000); // Wait for fonts and canvas drawings
        
        // Screenshot just the poster element
        const posterEl = await posterPage.$('.poster');
        if (posterEl) {
            await posterEl.screenshot({ path: path.join(ROOT, 'poster.png'), type: 'png' });
            console.log('  -> poster.png (high-res for print)');
        } else {
            await posterPage.screenshot({ path: path.join(ROOT, 'poster.png'), fullPage: true });
            console.log('  -> poster.png (full page fallback)');
        }
        await posterPage.close();

        console.log('\nAll captures complete!');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await browser.close();
        server.kill();
        process.exit(0);
    }
}

main();
