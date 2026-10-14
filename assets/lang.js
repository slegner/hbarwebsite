// Loaded in <head> so the page renders in the visitor's language from the first paint.
// Text for each language sits side by side in the HTML as <span data-l="en|zh-Hans|zh-Hant">;
// style.css hides every version that doesn't match <html lang>.
(function () {
  var LANGS = ["en", "zh-Hans", "zh-Hant"];
  var lang = null;
  try { lang = localStorage.getItem("hbar-lang"); } catch (e) {}
  if (LANGS.indexOf(lang) < 0) {
    // Simplified for mainland China / Singapore / Malaysia / zh-Hans; Traditional for other Chinese locales.
    var locale = navigator.language || "";
    lang = !/^zh\b/i.test(locale) ? "en" : /hans|cn|sg|my/i.test(locale) ? "zh-Hans" : "zh-Hant";
  }
  document.documentElement.lang = lang;
})();
