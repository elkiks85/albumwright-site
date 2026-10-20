# albumwright.com

The public website for Albumwright. Plain static files: no build step, no framework, no analytics, no cookies, and no requests to other websites at runtime. Fonts are self-hosted.

Hosted on GitHub Pages with the custom domain in `CNAME` (`albumwright.com`). DNS is at GoDaddy.

## Structure

```
site/
  index.html          Landing page: hero, the four steps, album folder, Library, accounts, requirements, pricing, FAQ
  support.html        Contact, install guide, troubleshooting
  privacy.html        Privacy policy
  terms.html          Terms of use and sale
  refunds.html        Refund policy
  404.html            Not-found page (uses root-absolute /assets/ paths because GitHub Pages serves it at any URL)
  CNAME               albumwright.com
  robots.txt, sitemap.xml
  favicon.ico         16, 32 and 48 px PNGs in one file
  favicon.svg         The mark
  apple-touch-icon.png
  assets/
    launch.js         THE LAUNCH SWITCH: store, checkout and helper URLs (see below)
    site.js           Applies launch.js to every button; nothing else
    site.css          All styles ("night console" tokens at the top)
    albumwright-logo.svg, albumwright-mark.svg
    og-image.png      1200 x 630 link preview
    fonts/            Barlow and Barlow Semi Condensed (woff2) + OFL.txt licence
    screens/          Product screenshots (side panel captures)
    art/              Album covers used on the landing page
```

## Launching: flip the switch in `assets/launch.js`

Every call to action on the site is driven by four URLs:

```js
window.ALBUMWRIGHT_LAUNCH = {
  chromeStoreUrl: '',
  checkoutMonthlyUrl: '',
  checkoutYearlyUrl: '',
  helperDownloadUrl: ''
};
```

- Empty (`''`): the matching buttons read **Join the private beta** and open an email to support@albumwright.com with the subject "Albumwright beta".
- A full `https://` URL: the buttons switch to **Add to Chrome**, **Buy Pro monthly**, **Buy Pro yearly** or **Download the helper**, and link there.

Each URL is independent, so you can launch in stages (for example the store listing first, checkout later). While both checkout URLs are empty, the Pro card shows a single beta button instead of two. A few sentences change with `chromeStoreUrl` too (elements marked `data-show="beta"` or `data-show="live"`), for example the hero's fine print and the closing call to action.

No other file needs editing at launch. Commit `launch.js`, push, and GitHub Pages republishes within a minute or two.

The HTML ships in the beta state, so if JavaScript is off the buttons still work as beta email links.

### How the buttons are wired

Any link with `data-cta="store" | "monthly" | "yearly" | "helper"` is managed by `site.js`. To add a button anywhere, copy an existing one:

```html
<a class="btn btn-primary" data-cta="store" href="mailto:support@albumwright.com?subject=Albumwright%20beta">Join the private beta</a>
```

Optional attributes: `data-live-label="…"` and `data-beta-label="…"` override the default button text.

## Replacing screenshots

Screenshots in `assets/screens/` are referenced by file name: `brief.png`, `singers.png`, `tracks.png`, `deliver.png`, `library.png`, `lyrics.png`. Replace them with new captures using the same names. Any tall side-panel crop works: the page shows them at a 74:100 ratio, cropped from the top, so an image around 1110 × 1500 fits best. Update the `alt` text in `index.html` if what a screenshot shows changes.

The covers in `assets/art/` (`front.jpg`, `back.jpg`, `front-thumb.jpg`) are from the example album *After the Last Exit* by Velvet Slipstream.

## Previewing locally

Open `index.html` directly in a browser, or serve the folder so root-absolute paths in `404.html` work:

```
npx serve site
```

## Rules for edits

- Keep every page's footer: the company disclosure and the not-affiliated sentence. See `brand/brand.md`.
- Don't add external scripts, fonts, images, analytics or embeds. The privacy policy states that the site makes no third-party requests; change the policy first if that ever changes.
- Legal pages carry "Effective date: 20 October 2026". Update the date when their content changes, and update `sitemap.xml` `lastmod`.
