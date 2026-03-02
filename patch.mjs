import fs from 'fs';

const filesToPatch = [
    '.open-next/server-functions/default/handler.mjs',
    '.open-next/middleware/handler.mjs'
];

for (const file of filesToPatch) {
    if (fs.existsSync(file)) {
        console.log(`Patching ${file}...`);
        let content = fs.readFileSync(file, 'utf8');

        // Strip the ?module modifier that breaks Windows file paths in esbuild Wrangler
        const initialLength = content.length;
        content = content.replace(/resvg\.wasm\?module/g, 'resvg.wasm');
        content = content.replace(/yoga\.wasm\?module/g, 'yoga.wasm');

        if (content.length !== initialLength) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Successfully patched WASM modifiers in ${file}`);
        } else {
            console.log(`No WASM modifiers found in ${file}.`);
        }
    }
}
