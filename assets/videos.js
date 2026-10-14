// Renders data/videos.json into every [data-videos] grid on the page.
// A grid with data-limit shows that many videos with no paging (used on the home page);
// otherwise it pages with #load-more and filters with [data-video-filter] chips.

const PAGE_SIZE = 9;
const DATE_LOCALE = { en: "en-GB", "zh-Hans": "zh-CN", "zh-Hant": "zh-TW" };

const state = { filter: "all", shown: PAGE_SIZE, videos: [] };
const grid = document.querySelector("[data-videos]");
const limit = Number(grid.dataset.limit) || null;
const moreBtn = document.getElementById("load-more");
const player = document.getElementById("player");

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(DATE_LOCALE[document.documentElement.lang] || "en-GB", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function render() {
  const list = state.videos.filter((v) => state.filter === "all" || v.lang === state.filter);
  const shown = list.slice(0, limit || state.shown);
  grid.replaceChildren(
    ...shown.map((v) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.innerHTML = `
        <div class="thumb"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg"></div>
        <h3></h3>
        <div class="meta"><span class="tag">${v.lang === "zh" ? "中文" : "EN"}</span><time datetime="${v.published}">${formatDate(v.published)}</time></div>`;
      card.querySelector("h3").textContent = v.title;
      card.addEventListener("click", () => openPlayer(v.id));
      return card;
    })
  );
  if (!list.length) {
    grid.innerHTML = `<p class="empty"><span data-l="en">Nothing on tap yet.</span><span data-l="zh-Hans">暂时还没有视频。</span><span data-l="zh-Hant">暫時還沒有影片。</span></p>`;
  }
  if (moreBtn) moreBtn.hidden = shown.length >= list.length;
}

function openPlayer(id) {
  player.querySelector(".frame").innerHTML =
    `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="YouTube video"></iframe>`;
  player.showModal();
}

player.addEventListener("close", () => (player.querySelector(".frame").innerHTML = ""));
player.querySelector(".close").addEventListener("click", () => player.close());
player.addEventListener("click", (e) => { if (e.target === player) player.close(); });

document.querySelectorAll("[data-video-filter]").forEach((chip, _, chips) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    state.filter = chip.dataset.videoFilter;
    state.shown = PAGE_SIZE;
    render();
  })
);

moreBtn?.addEventListener("click", () => {
  state.shown += PAGE_SIZE;
  render();
});

document.addEventListener("hbar:lang", render);

fetch("data/videos.json")
  .then((r) => r.json())
  .then((videos) => { state.videos = videos; })
  .catch(() => {})
  .finally(render);
