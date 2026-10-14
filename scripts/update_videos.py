#!/usr/bin/env python3
"""Fetch the latest videos from the H-bar YouTube channel feed into data/videos.json.

YouTube's RSS feed returns the 15 most recent uploads. Videos already in
data/videos.json are kept, so the archive grows over time instead of being
truncated to the feed window.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

CHANNEL_ID = "UChEC0LL4QfpA4m2X0DGIzbQ"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
OUT = Path(__file__).resolve().parent.parent / "data" / "videos.json"

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
CJK = re.compile(r"[㐀-鿿]")


def fetch_feed():
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())
    videos = []
    for entry in root.findall("atom:entry", NS):
        vid = entry.findtext("yt:videoId", namespaces=NS)
        title = entry.findtext("atom:title", namespaces=NS)
        description = entry.findtext("media:group/media:description", default="", namespaces=NS)
        videos.append({
            "id": vid,
            "title": title,
            "published": entry.findtext("atom:published", namespaces=NS),
            "lang": "zh" if CJK.search(title) else "en",
            "description": description.strip().split("\n")[0][:280],
        })
    return videos


def main():
    existing = json.loads(OUT.read_text()) if OUT.exists() else []
    merged = {v["id"]: v for v in existing}
    for v in fetch_feed():
        merged[v["id"]] = v
    videos = sorted(merged.values(), key=lambda v: v["published"], reverse=True)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(videos, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(videos)} videos to {OUT}")


if __name__ == "__main__":
    main()
