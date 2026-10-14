# H-bar · Talk Science in a Bar (h 吧)

Website for the [H-bar talk Science](https://www.youtube.com/@H-bartalkScienceH) YouTube channel by Wei-Ning Deng and Sinah Legner.

A plain static site (no build step) hosted on GitHub Pages.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The page |
| `assets/style.css`, `assets/main.js` | Styling, video grid, EN/中文 toggle |
| `data/videos.json` | Video list rendered on the page |
| `scripts/update_videos.py` | Pulls new uploads from the channel's RSS feed into `data/videos.json` |
| `.github/workflows/update-videos.yml` | Runs the script daily and commits any new videos |

## Editing

- **Text:** English lives in `index.html`; Chinese translations are in the `I18N` object at the top of `assets/main.js` (keyed by each element's `data-i18n`).
- **Videos:** added automatically. To refresh by hand: `python3 scripts/update_videos.py`. Older videos are kept even after they drop out of the feed (which only shows the latest 15).

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

Repo → Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
