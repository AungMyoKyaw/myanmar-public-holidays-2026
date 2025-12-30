import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
	const browser = await chromium.launch();
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 2
	});

	const htmlPath = join(__dirname, 'static', 'og-image.html');
	await page.goto(`file://${htmlPath}`);

	// Wait for any animations or fonts to load
	await page.waitForTimeout(1000);

	const outputPath = join(__dirname, 'static', 'og-image.png');
	await page.screenshot({
		path: outputPath,
		type: 'png'
	});

	console.log(`✅ OG image generated: ${outputPath}`);

	await browser.close();
}

generateOGImage().catch(console.error);
