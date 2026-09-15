# Performance checks

Measured locally on September 15, 2026. These are lab measurements, not guarantees for every phone or connection.

## Same-condition comparison

Chromium 145.0.7632.6, headless, 390 x 844 viewport, 2x pixel density, touch enabled. CPU throttled 4x, network latency 150ms, download 150 KB/s, cache disabled. Three fresh browser contexts per version; table shows medians. Both versions used the same machine and instrumentation.

| Measurement | Before | After |
| --- | ---: | ---: |
| Transferred resource bodies | 20,752 bytes | 5,417 bytes |
| Uncompressed resource bodies | 20,752 bytes | 14,918 bytes |
| First contentful paint | 556ms | 456ms |
| DOM ready | 555.3ms | 456.9ms |
| JS animation callback time over a 3-second reveal | 454.5ms | 45.6ms |
| Canvas strokes during that reveal | 48,914 | 7,680 |
| Animation callbacks after hiding (500ms observation) | 0 | 0 |

About 74% less transfer, 18% earlier first paint, and 90% less measured animation-callback time. HTML/CSS/JS cleanup and gzip both contribute to the transfer change. This is not a Lighthouse score or a claim of 90% faster total rendering.

Before FCP runs: 796 / 552 / 556ms. After: 456 / 448 / 464ms.
Before callback time: 438.3 / 454.5 / 468.2ms. After: 45.6 / 65.1 / 36.3ms.

The callback measurement wraps requestAnimationFrame callbacks, including their synchronous canvas commands. It excludes browser paint/compositing, initial iris preparation, and timer work. The optimized eye deliberately has a lower frame cap; under this throttled harness the median callback counts were 74 before and 32 after over 3 seconds. Lower callback time does not mean a higher frame rate. The unchanged iris detail is reused instead of redrawn. The 240 animated flame strands remain.

The after sample predates the final label/favicon-only changes; deployment delivery may use different compression and caching. Network-independent reveal is checked after the initial page load; this is not an installable offline app.

## Checked behavior

- Chromium and Firefox: touch show/hide, immediate disappearance of light and plaintext, keyboard activation/Escape, no focus forced into the input when opening the eye, silent autofill synchronization, literal HTML-like input, reduced-motion still frame, offline reveal, submission and return.
- Layouts checked from 320 through 1920 CSS pixels and short landscape windows.
- Live Vercel site: Chromium iPhone SE and iPhone 13 device emulation, 540x720 Duo-sized viewport, and 1440x900 desktop all passed touch toggle, overflow, instant light removal, HTTPS submission/redirect, the minimal completion screen, and return navigation. These are emulations, not physical-device tests or verification of foldable hinge behavior.
- WebKit: rendering and keyboard reveal/hide checked. Native touch automation on this Windows runner has a coordinate-scaling mismatch and did not pass; physical Safari/iPhone touch remains unverified.
- No physical-device, old-browser, real password-vault, or real slow-network guarantee. Unsupported CSS masks fall back to a conventional password visibility toggle.

## What changed

The iris is prepared once, flame constants are precomputed, canvas resolution is capped at 2x display density, and drawing stops when hidden. Pointer updates are combined into one animation-frame update. Lighting covers only the viewport. Static files are compressed, there are no third-party assets, and the app has no framework runtime.
