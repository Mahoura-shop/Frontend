// Removes white/near-white backgrounds from all jpg/jpeg images in src/assets/landing/
// Outputs transparent PNGs in the same folder.
// Usage: node scripts/removeBg.js
// No install needed — uses sharp which Next.js already includes.

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT_DIR = path.join(__dirname, "../src/assets/landing");
// Pixels within this distance from pure white become transparent.
// Lower = stricter (only pure white). Raise to 50+ if light-gray remnants remain.
const THRESHOLD = 35;

async function processImage(filePath) {
	const image = sharp(filePath);
	const { width, height } = await image.metadata();

	const { data, info } = await image
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const dist = Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2);
		if (dist < THRESHOLD) {
			// Soft edge: pixels close to white fade out gradually
			data[i + 3] = Math.round((dist / THRESHOLD) * 255);
		}
	}

	const outPath = filePath.replace(/\.(jpg|jpeg)$/i, ".png");
	await sharp(data, {
		raw: { width: info.width, height: info.height, channels: 4 },
	})
		.png()
		.toFile(outPath);

	console.log("  Done:", path.basename(outPath));
}

async function main() {
	const files = fs
		.readdirSync(INPUT_DIR)
		.filter((f) => /\.(jpg|jpeg)$/i.test(f))
		.map((f) => path.join(INPUT_DIR, f));

	if (!files.length) {
		console.log("No jpg/jpeg files found in", INPUT_DIR);
		return;
	}

	console.log(`Processing ${files.length} image(s)...`);
	for (const f of files) {
		await processImage(f);
	}
	console.log("\nAll done. Now update bgPortraits.ts to import the .png files.");
}

main().catch(console.error);
