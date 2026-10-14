# H-bar · Talk Science in a Bar (h 吧)

Website for the [H-bar talk Science](https://www.youtube.com/@H-bartalkScienceH) YouTube channel by Wei-Ning Deng and Sinah Legner.

A plain static site (no build step) hosted on GitHub Pages.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero, Vision 2040 banner, latest 3 videos, short about, call to action |
| `videos.html` | All videos, filterable by English / 中文 |
| `about.html` | Vision, why a bar, and the team (Wei-Ning & Sinah) |
| `contact.html` | Contact form (sent via [FormSubmit](https://formsubmit.co) to hbartalkscience@gmail.com) |
| `assets/site.js` | Shared header, footer and the EN / 简 / 繁 switch |
| `assets/lang.js` | Picks the language before the page renders (saved choice, else browser language) |
| `assets/videos.js` | Renders the video grid |
| `assets/people/` | Profile photos |
| `data/videos.json` | Video list (auto-updated) |
| `scripts/update_videos.py` | Pulls new uploads from the channel's RSS feed into `data/videos.json` |
| `.github/workflows/update-videos.yml` | Runs the script daily and commits any new videos |

## Editing

- **Text:** every piece of page text appears three times, side by side:
  ```html
  <span data-l="en">Videos</span>
  <span data-l="zh-Hans">视频</span>
  <span data-l="zh-Hant">影片</span>
  ```
  Only the one matching the selected language is shown. Nav and footer links live in the `NAV` list in `assets/site.js`.
- **New page:** copy an existing page, change `<body data-page="...">`, and add it to `NAV` in `assets/site.js`.
- **Videos:** added automatically. To refresh by hand: `python3 scripts/update_videos.py`. Older videos are kept even after they drop out of the feed (which only shows the latest 15).

## Contact form

The form posts to FormSubmit, which emails each message to hbartalkscience@gmail.com — no server needed.
The **first** submission triggers a one-time activation email to that inbox; click the link in it, otherwise
no messages are delivered. After activating, FormSubmit also offers a random alias you can put in the form's
`action` instead of the address itself, to keep it out of the page source.

## Search & sharing (SEO)

- Each page has its own title, description, canonical URL, Open Graph / Twitter tags and the share image `assets/og-image.png`.
- `index.html` and `about.html` include schema.org structured data (organisation, website, and both hosts).
- `robots.txt` and `sitemap.xml` point search engines at every page.
- All of these use the full site address `https://hbartalkscience.com/` (the custom domain set in `CNAME`). If the domain ever changes, search-and-replace that address across the repo.
- After the site is live, add it to [Google Search Console](https://search.google.com/search-console) (and Bing Webmaster Tools / Baidu if useful) and submit `sitemap.xml`.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

Repo → Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
