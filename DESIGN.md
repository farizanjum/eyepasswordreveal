# Design notes

Original concept and interaction: **Jhey (@jh3yy)**.
[See the original post](https://x.com/jh3yy/status/2099669732592947517).
This project is a code recreation, not Jhey's original source or an official collaboration.

## Appearance

- Charcoal background (`#111111`) with a faint grid.
- White headings and light gray labels (`#bbbbbb`).
- Rounded dark fields (`#1a1a1a`), 8px corners, 16px input text.
- A centered form up to 440px wide, with 20px side padding on small screens.
- The reveal dims the page by only 28%, keeping the form readable outside the beam.
- The main form contains no helper paragraph; the completion screen is simply "All set." and "Back".

## Effect

- A WebGL eye with a white-hot iris, orange flame tongues, turbulent motion, and a dark vertical pupil. A Canvas renderer is retained as a fallback for unavailable/lost WebGL contexts.
- The eye rises 28px above its button and casts a 36-degree spotlight.
- Spotlight length follows the distance to the pointer. Password and label reveal masks use the same radius, so text beyond the beam stays masked.
- Only password text within the beam is shown by the visual overlay.
- Illuminated password text and its label use an animated SVG displacement filter for the heat-shimmer distortion visible in both reference videos. The text mask remains opaque so native password dots do not bleed through the letters. Only the visual copy is distorted; the input value is unchanged.
- Escape, focus loss, or inactivity hides the reveal and clears the overlay.
- Reduced-motion settings stop flame movement and CSS transitions.
- The shader runs up to 60fps at 480x280; the Canvas fallback caches its static iris. Screen-sized lighting layers use screen blending, preserving the warm beam. No fade remains after hiding.
- The eye scales down below 440px. Fields use 16px text and controls have 44px touch targets. Scrolling outside the active password field stays available.

## Demo behavior

The password input stays a native password field in browsers with CSS masks. Older browsers without masks use a conventional text/password toggle rather than a broken spotlight. Browser autofill uses standard username and current-password fields. Submitting dummy credentials sends them to the server, which discards them. There is no account database.

This is an approximation of Jhey's effect; the eye artwork is rendered by this implementation rather than copied from the video.
