# Fiery Eye Password Reveal

A free code recreation of the password-reveal effect created by **Jhey (@jh3yy)**.

**[Live website](https://eyepasswordreveal.vercel.app)** · **[Source code](https://github.com/farizanjum/eyepasswordreveal)**

## Credit to the original creator

**The original idea, design, and interaction belong to Jhey.** We recreated the effect in HTML, CSS, and JavaScript for this demo. We are not claiming to have invented it, and this is not Jhey's original source code or an official collaboration.

- [Jhey on X](https://x.com/jh3yy)
- [Original password-reveal post](https://x.com/jh3yy/status/2099669732592947517)

Please keep this credit and the original link when sharing this project, including on GitHub.

## Start it

Install Node.js if you do not already have it. Open a terminal in this project folder and run:

```sh
npm start
```

Open **http://127.0.0.1:3001** in your browser. No package installation is needed.

Press **Ctrl+C** in the terminal to stop the server. If the port is already in use, the demo may already be running: try opening the address above.

## Try it

1. Enter a dummy ID and password.
2. Click the eye and move your pointer to reveal the password inside the light beam. The illuminated letters and Password label have the heat-shimmer distortion seen in Jhey's videos.
3. Click the eye again or press **Escape** to hide it.

To test browser autofill, click **Continue** and accept your browser's Save prompt if one appears. Click **Back** to return. If no prompt appears, manually add a test login in your browser's password manager for the exact site address you are using.

## A quick safety note

Use dummy credentials only. This is a visual demo, not a real login system. The server discards submissions; the app does not save passwords or create accounts. Hosting providers handle requests under their own policies. Your browser controls password saving and autofill. The reveal effect is visual masking, not encryption.

## Phones and performance

Small-screen layouts, 44px touch controls, reduced-motion support, and no external fonts, images, trackers, or frameworks. The eye works without further network access once the page has loaded. Offline reload and form submission still need a server connection.

The iris is rendered once and reused. The eye retains its detailed 480x280 rendering, with flame updates up to 60fps and no animation when hidden. Text shimmer also stops when hidden, and reduced-motion mode disables both effects. [Measured before/after results and browser coverage](PERFORMANCE.md).

## Publish on Vercel

Import this repository into Vercel. The included configuration builds the static files and adds the small submission handler. No environment variables or database are needed. `npm run build` creates the static files locally.

This instance was deployed with the authenticated Vercel CLI (`vercel --prod`). Automatic GitHub deployments are not connected yet: Vercel requires the account owner to add a GitHub Login Connection first.

## License

This implementation is free under the [ISC license](LICENSE). Jhey retains credit for the original concept; this license does not claim ownership of his work.

## Files

- `index.html`: the form
- `style.css`: the appearance and spotlight
- `eye.js`: the animated eye
- `script.js`: reveal and autofill interactions
- `server.js`: the local demo server
- `api/demo-login.js`, `build.js`, `vercel.json`: Vercel deployment
