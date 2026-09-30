# TruePath Consulting Website

Static site for **truepath.online**, hosted on GitHub Pages. Plain HTML, CSS, and JS with no build step.

- Design and hosting notes are kept locally by the site owner.
- Branches: `dev` is where work happens; `main` is what GitHub Pages publishes.

## Preview locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765

## Project layout

| Path | What it is |
|---|---|
| `index.html` | The whole page: nav, hero, services, process, extras, about, shop, contact, footer |
| `assets/css/style.css` | Design tokens (colors, fonts, dark mode) and all styles |
| `assets/js/main.js` | Mobile nav, compass swing, scroll path line, reveals, contact form |
| `assets/img/logo-full.svg` | Logo lockup (compass and wordmark), recolors with the theme |
| `assets/img/logo-mark.svg` | The four-point compass, used in the hero |
| `assets/img/kalil-olsen-*.jpg` | Headshot (400px and 800px) |
| `assets/icons/` | Favicon, app icons, and the social preview image (`og-image.png`) |
| `CNAME` | Custom domain for GitHub Pages (`truepath.online`). Do not delete. |
| `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll` | Hosting and SEO files |

## Common edits

- **Copy:** edit `index.html` directly. Each section has an `id` (`services`, `process`, `more`, `about`, `shop`, `contact`).
- **Colors and fonts:** change the variables at the top of `assets/css/style.css`.
- **Contact form:** uses Web3Forms. The access key is in the hidden `access_key` field in `index.html`. Keys are public by design. Submissions are emailed to the address registered with Web3Forms.
- **Social preview image:** `assets/icons/og-image.png` (1200x630). Regenerate it from `assets/icons/social.svg` if the tagline changes.

## Before launch checklist

- [x] Web3Forms access key connected and tested
- [x] Email, phone, and eBay link added
- [x] Headshot added
- [ ] Repo visibility: make `truepath-dev` public (Pages on a free plan needs a public repo)
- [ ] Merge `dev` into `main`, then enable Pages (Settings, Pages, Deploy from branch, `main`, root)
- [ ] DNS: move to Cloudflare and add the GitHub Pages records (see local notes)
- [ ] Enforce HTTPS in Pages settings once the certificate is issued
- [ ] Add the Cloudflare Web Analytics snippet before `</body>` in `index.html` (Cloudflare, Web Analytics)
- [ ] Send a test email to contact@truepath.online after the DNS move to confirm SimpleLogin still delivers
- [ ] Submit the live site to a link-preview checker (paste the URL in a chat app) to confirm the social image shows

## Accessibility and performance notes

- Contrast checked in light and dark themes (body text 7:1 or better; focus ring is the ink color for 3:1 or better).
- Keyboard: skip link, visible focus, Escape closes the mobile menu.
- Motion: the compass sway, scroll path line, and reveals are all disabled for `prefers-reduced-motion`.
- Weight: about 20 KB of CSS and JS, plus two web-sized images. Fonts load from Google Fonts.
