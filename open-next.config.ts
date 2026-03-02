// default open-next.config.ts file required to bypass Windows resvg wsam crash
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
    // Prevent Windows dev build crash by stripping the image optimizer (resvg.wasm has invalid module pathing in base fs)
    // @ts-expect-error Types might be out of sync but this is required for Windows
    imageOptimization: false,
});
