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

- A live canvas eye with a fiery iris and moving flame strands.
- The eye rises 28px above its button and casts a 36-degree spotlight.
- Only password text within the beam is shown by the visual overlay.
- Escape, focus loss, or inactivity hides the reveal and clears the overlay.
- Reduced-motion settings stop flame movement and CSS transitions.
- The static iris is cached; flame frames are capped below 30fps. Screen-sized lighting layers replace oversized ones. No fade remains after hiding.
- The eye scales down below 440px. Fields use 16px text and controls have 44px touch targets. Scrolling outside the active password field stays available.

## Demo behavior

The password input stays a native password field in browsers with CSS masks. Older browsers without masks use a conventional text/password toggle rather than a broken spotlight. Browser autofill uses standard username and current-password fields. Submitting dummy credentials sends them to the server, which discards them. There is no account database.

This is an approximation of Jhey's effect; the eye artwork is rendered by this implementation rather than copied from the video.
