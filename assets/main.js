const PAGE_SIZE = 9;

const I18N = {
  zh: {
    "nav.videos": "本日特調",
    "nav.about": "關於",
    "nav.hosts": "調酒師",
    "hero.eyebrow": "歡迎來到 h 吧",
    "hero.title": "在酒吧裡<br>輕鬆聊科學。",
    "hero.lede": "沒有死板的課本，只有用生動比喻、簡單有趣的方式，為你調製的一杯杯「物理特調」。拉張椅子坐下吧！",
    "hero.subscribe": "訂閱 YouTube 頻道",
    "hero.browse": "看看今天有什麼",
    "videos.title": "本日特調",
    "videos.all": "全部",
    "videos.more": "再來一輪",
    "about.title": "為什麼是酒吧？",
    "about.p1": "很多人覺得科學充滿了冰冷的公式，但對我們來說，宇宙的運行充滿了難以置信的美感——而這種美，最適合在像酒吧一樣輕鬆的空間裡聊。",
    "about.p2": "「h 吧」的名字來自 ħ（h-bar），量子力學核心的約化普朗克常數。每一集都是一杯招牌特調：從魔角石墨烯到南極的微中子，以中文和英文雙語呈現。",
    "hosts.title": "你的調酒師",
    "hosts.wd": "英國劍橋大學卡文迪許實驗室物理博士，專研理論物理與宇宙學。",
    "hosts.sl": "h 吧共同主持人。",
  },
};

const state = { filter: "all", shown: PAGE_SIZE, videos: [], lang: "en" };
const grid = document.getElementById("video-grid");
const moreBtn = document.getElementById("load-more");
const player = document.getElementById("player");

// Remember English strings so the toggle can switch back.
const EN = {};
document.querySelectorAll("[data-i18n]").forEach((el) => (EN[el.dataset.i18n] = el.innerHTML));

function setLang(lang) {
  state.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = (lang === "zh" && I18N.zh[key]) || EN[key];
  });
  document.querySelector(".lang-toggle").textContent = lang === "zh" ? "EN" : "中文";
  try { localStorage.setItem("hbar-lang", lang); } catch {}
  render();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(state.lang === "zh" ? "zh-TW" : "en-GB", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function render() {
  const list = state.videos.filter((v) => state.filter === "all" || v.lang === state.filter);
  grid.replaceChildren(
    ...list.slice(0, state.shown).map((v) => {
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
  if (!list.length) grid.innerHTML = '<p class="empty">Nothing on tap yet.</p>';
  moreBtn.hidden = state.shown >= list.length;
}

function openPlayer(id) {
  player.querySelector(".frame").innerHTML =
    `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="YouTube video"></iframe>`;
  player.showModal();
}

function closePlayer() {
  player.close();
}

player.addEventListener("close", () => (player.querySelector(".frame").innerHTML = ""));
player.querySelector(".close").addEventListener("click", closePlayer);
player.addEventListener("click", (e) => { if (e.target === player) closePlayer(); });

document.querySelectorAll(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    state.filter = chip.dataset.filter;
    state.shown = PAGE_SIZE;
    render();
  })
);

moreBtn.addEventListener("click", () => {
  state.shown += PAGE_SIZE;
  render();
});

document.querySelector(".lang-toggle").addEventListener("click", () =>
  setLang(state.lang === "zh" ? "en" : "zh")
);

document.getElementById("year").textContent = new Date().getFullYear();

let savedLang = null;
try { savedLang = localStorage.getItem("hbar-lang"); } catch {}
if (!savedLang && navigator.language?.startsWith("zh")) savedLang = "zh";

fetch("data/videos.json")
  .then((r) => r.json())
  .then((videos) => { state.videos = videos; })
  .catch(() => {})
  .finally(() => setLang(savedLang || "en"));
