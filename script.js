// Builds the text parts of the public page from window.PORTFOLIO (see portfolio.js).
(function () {
  var d = window.PORTFOLIO || {};
  var hero = d.hero || {};
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function link(text, url, cls) {
    if (!/^https?:\/\//i.test(url || "")) return null; // only http(s) links
    var a = el("a", cls, text);
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    return a;
  }

  if (hero.title) $("title").textContent = hero.title;
  $("byline").textContent = hero.byline ? " " + hero.byline : "";
  document.title = (hero.title || "Portfolio") + (hero.byline ? " " + hero.byline : "");
  $("lead").textContent = hero.lead || "";
  $("note").textContent = hero.note || "";
  $("projects-title").textContent = d.projectsTitle || "Projects";

  var box = $("projects");
  var shown = (d.projects || []).filter(function (p) { return p.visible !== false; });
  if (!shown.length) box.appendChild(el("p", "empty", "Nothing here yet."));

  shown.forEach(function (p) {
    var row = el("article", "project");
    row.appendChild(el("h3", "", p.title));

    var text = el("div", "text");
    if (p.description) text.appendChild(el("p", "", p.description));
    if (p.details) text.appendChild(el("p", "tags", p.details));
    row.appendChild(text);

    var links = el("p", "links");
    var open = link("Open visualisation", p.url, "button");
    var src = link("Source code", p.repo);
    if (open) links.appendChild(open);
    if (src) links.appendChild(src);
    row.appendChild(links);
    box.appendChild(row);
  });

  var f = d.footer || {};
  var fl = $("footer-link");
  if (f.text) fl.textContent = f.text;
  if (/^https?:\/\//i.test(f.url || "")) fl.href = f.url;
})();
