// Shared header, footer and language switch for every page.
// Each page sets <body data-page="..."> to highlight its nav link.

const NAV = [
  { page: "home", href: "./", en: "Home", hans: "首页", hant: "首頁" },
  { page: "about", href: "about.html", en: "About", hans: "关于我们", hant: "關於我們" },
  { page: "videos", href: "videos.html", en: "Videos", hans: "视频", hant: "影片" },
  { page: "tools", href: "ai-tools.html", en: "AI tools", hans: "AI 工具", hant: "AI 工具" },
  { page: "contact", href: "contact.html", en: "Contact", hans: "联系我们", hant: "聯絡我們" },
];

const YOUTUBE = "https://www.youtube.com/@H-bartalkScienceH";
const EMAIL = "hbartalkscience@gmail.com";

function tri(en, hans, hant) {
  return `<span data-l="en">${en}</span><span data-l="zh-Hans">${hans}</span><span data-l="zh-Hant">${hant}</span>`;
}

function renderHeader() {
  const header = document.querySelector("header.nav");
  const current = document.body.dataset.page;
  header.innerHTML = `
    <a class="brand" href="./">
      <img src="assets/logo.jpg" alt="" width="36" height="36">
      <span>H-bar <small>h 吧</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="menu" id="site-menu">
      <nav>
        ${NAV.map((n) => `<a href="${n.href}"${n.page === current ? ' aria-current="page"' : ""}>${tri(n.en, n.hans, n.hant)}</a>`).join("")}
      </nav>
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" data-lang="en" lang="en">EN</button>
        <button type="button" data-lang="zh-Hans" lang="zh-Hans">简</button>
        <button type="button" data-lang="zh-Hant" lang="zh-Hant">繁</button>
      </div>
    </div>`;

  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  header.querySelectorAll(".lang-switch button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );
}

function renderFooter() {
  document.querySelector("footer.footer").innerHTML = `
    <div>
      <p class="footer-brand">H-bar <small>h 吧</small></p>
      <p>${tri("Talk science in a bar.", "在酒吧里轻松聊科学。", "在酒吧裡輕鬆聊科學。")}</p>
      <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
    <nav>
      ${NAV.map((n) => `<a href="${n.href}">${tri(n.en, n.hans, n.hant)}</a>`).join("")}
      <a href="${YOUTUBE}" target="_blank" rel="noopener">YouTube</a>
    </nav>
    <p class="copy">© ${new Date().getFullYear()} H-bar · Wei-Ning Deng &amp; Sinah Legner</p>`;
}

function setLang(lang) {
  document.documentElement.lang = lang;
  try { localStorage.setItem("hbar-lang", lang); } catch {}
  syncLangSwitch();
  document.dispatchEvent(new CustomEvent("hbar:lang", { detail: lang }));
}

function syncLangSwitch() {
  const lang = document.documentElement.lang;
  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.lang === lang)
  );
  // Placeholders can't hold markup, so they carry each language in data-ph-en / -zh-hans / -zh-hant.
  const key = { en: "phEn", "zh-Hans": "phZhHans", "zh-Hant": "phZhHant" }[lang];
  document.querySelectorAll("[data-ph-en]").forEach((el) => (el.placeholder = el.dataset[key]));
}

renderHeader();
renderFooter();
syncLangSwitch();
