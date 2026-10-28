// ===== Settings: change these if your repo differs =====
var OWNER  = "victorreyesgit";
var REPO   = "Portfolio";
var BRANCH = "main";
var FILE   = "portfolio.js";
// Same storage key as the Home hub admin: on a GitHub user site (victorreyesgit.github.io)
// both admin pages share one origin, so a token saved in one is found by the other.
var KEY = "projectsHubToken";
// =======================================================

var API = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + FILE;
var data = null, sha = null, prefix = "", dirty = false;
var $ = function (id) { return document.getElementById(id); };

function say(msg, kind) { var s = $("status"); s.textContent = msg; s.className = kind || ""; }
function token() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
function hdr(json) {
  var h = { "Authorization": "Bearer " + token(), "Accept": "application/vnd.github+json" };
  if (json) h["Content-Type"] = "application/json";
  return h;
}
function dec(b64) {
  var bin = atob(b64.replace(/\s/g, "")), u = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(u);
}
function enc(str) {
  var u = new TextEncoder().encode(str), bin = "";
  for (var i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
  return btoa(bin);
}
async function explain(r) {
  var m = ""; try { m = (await r.json()).message || ""; } catch (e) {}
  if (r.status === 401) return "GitHub rejected the token (401). It may be expired or mistyped. Forget it and paste a new one.";
  if (r.status === 403) return "Access denied (403). Check the token has Contents: Read and write. " + m;
  if (r.status === 404) return "Not found (404). Either OWNER/REPO/BRANCH/FILE at the top of admin.js are wrong, or this token cannot access the " + REPO + " repo (a token made only for another repo, such as Home, needs " + REPO + " added to its repository access).";
  return "GitHub error " + r.status + ". " + m;
}

function showToken() {
  var has = !!token();
  $("tokenNew").hidden = has; $("tokenHave").hidden = !has;
}

async function load() {
  if (!token()) return say("Paste a token first.", "err");
  say("Loading from GitHub…");
  try {
    var r = await fetch(API + "?ref=" + encodeURIComponent(BRANCH), { headers: hdr(), cache: "no-store" });
    if (!r.ok) throw new Error(await explain(r));
    var j = await r.json();
    var txt = dec(j.content);
    var m = /^window\.PORTFOLIO\s*=/m.exec(txt);
    if (!m) throw new Error("Could not find 'window.PORTFOLIO =' at the start of a line in " + FILE + ".");
    var a = txt.indexOf("{", m.index), b = txt.lastIndexOf("}");
    var parsed;
    try { parsed = JSON.parse(txt.slice(a, b + 1)); }
    catch (e) { throw new Error(FILE + " is not valid JSON (check quotes and trailing commas). Fix it on github.com, then reload. " + e.message); }
    parsed.hero = parsed.hero || {};
    parsed.projects = parsed.projects || [];
    parsed.footer = parsed.footer || {};
    data = parsed; sha = j.sha; prefix = txt.slice(0, m.index);
    setDirty(false); render(); $("saveBar").hidden = false;
    say("Loaded " + FILE + " from " + REPO + " (" + BRANCH + ").", "ok");
  } catch (e) { say(e.message || String(e), "err"); }
}

function clean() {
  var h = data.hero, f = data.footer;
  var out = {
    hero: { title: h.title || "", byline: h.byline || "", lead: h.lead || "", note: h.note || "" },
    projectsTitle: data.projectsTitle || "Projects",
    projects: data.projects.map(function (p) {
      var o = { title: p.title || "", description: p.description || "", details: p.details || "",
                url: p.url || "", visible: p.visible !== false };
      if (p.repo) o.repo = p.repo;
      return o;
    }),
    footer: { text: f.text || "", url: f.url || "" }
  };
  return prefix + "window.PORTFOLIO = " + JSON.stringify(out, null, 2) + ";\n";
}

async function save() {
  say("Saving…");
  $("save").disabled = true;
  try {
    var r = await fetch(API, { method: "PUT", headers: hdr(true), body: JSON.stringify({
      message: "Update portfolio via admin page", content: enc(clean()), sha: sha, branch: BRANCH }) });
    if (r.status === 409 || r.status === 422) {
      say("Not saved: " + FILE + " changed on GitHub since you loaded it. Click “Reload from GitHub” and redo your edit. (Your unsaved edits would be overwritten otherwise.)", "err");
      $("save").disabled = false; return;
    }
    if (!r.ok) throw new Error(await explain(r));
    sha = (await r.json()).content.sha;
    setDirty(false);
    say("Saved. The site updates in about a minute.", "ok");
  } catch (e) { say(e.message || String(e), "err"); $("save").disabled = false; }
}

function setDirty(d) { dirty = d; $("save").disabled = !d; }
window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

// ---------- editor UI (mirrors the public page; every text is editable in place) ----------
function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
function btn(text, fn, cls) { var b = el("button", cls, text); b.type = "button"; b.onclick = fn; return b; }
function grow(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }
function changed() { setDirty(true); render(); }

// Borderless input/textarea that looks like the text it edits.
function ed(tag, value, set, placeholder, cls) {
  var i = el(tag, "ed" + (cls ? " " + cls : ""));
  if (tag === "input") i.type = "text"; else i.rows = 1;
  i.value = value || ""; i.placeholder = placeholder || ""; i.setAttribute("aria-label", placeholder || "");
  i.oninput = function () { set(i.value); setDirty(true); if (tag === "textarea") grow(i); };
  return i;
}
function line(label, value, set, placeholder) {
  var w = el("div", "fl"); w.append(el("span", "fl-l", label), ed("input", value, set, placeholder)); return w;
}
function move(arr, i, d) {
  var j = i + d; if (j < 0 || j >= arr.length) return;
  var t = arr[i]; arr[i] = arr[j]; arr[j] = t; changed();
}

// ---------- drag and drop (mouse; on touch screens use the ↑ ↓ buttons) ----------
var drag = null, target = null;
function clearMarks() {
  document.querySelectorAll(".mark-before, .mark-after, .drop-in").forEach(function (n) {
    n.classList.remove("mark-before", "mark-after", "drop-in");
  });
}
function dragSource(node, handle, info) {
  handle.addEventListener("mousedown", function () { node.draggable = true; });
  node.addEventListener("dragstart", function (e) {
    if (!node.draggable) return;              // ignore drags that did not start on the handle
    e.stopPropagation();
    drag = info; target = null;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "project");
    node.classList.add("dragging");
  });
  node.addEventListener("dragend", function () {
    node.draggable = false; node.classList.remove("dragging"); drag = null; target = null; clearMarks();
  });
}
document.addEventListener("mouseup", function () {
  document.querySelectorAll("[draggable=true]").forEach(function (n) { n.draggable = false; });
});
function dropProject() {
  if (!drag || target === null) return;
  var item = data.projects.splice(drag.pi, 1)[0];
  var idx = target;
  if (idx > drag.pi) idx--;
  data.projects.splice(idx, 0, item);
  drag = null; target = null; changed();
}
function isAfter(e, node) {
  var r = node.getBoundingClientRect();
  return e.clientY > r.top + r.height / 2;
}

// ---------- blocks ----------
function heroBlock() {
  var h = data.hero, w = el("header", "hero"), h1 = el("h1");
  h1.append(ed("input", h.title, function (v) { h.title = v; }, "Title"),
            ed("input", h.byline, function (v) { h.byline = v; }, "— by …", "by"));
  var intro = el("div", "intro");
  intro.append(ed("textarea", h.lead, function (v) { h.lead = v; }, "Big intro sentence", "lead"),
               ed("textarea", h.note, function (v) { h.note = v; }, "Smaller note under it", "note"));
  var fig = el("figure", "demo");
  fig.append(el("div", "fig-ph", "The schematic figure sits here on the public page. It lives in index.html, so it is not editable from this page."));
  w.append(h1, intro, fig);
  return w;
}

function projectBlock(p, pi) {
  var row = el("article", "project" + (p.visible === false ? " is-hidden" : ""));
  var h3 = el("h3");
  h3.append(ed("input", p.title, function (v) { p.title = v; }, "Project name"));

  var text = el("div", "text");
  text.append(
    ed("textarea", p.description, function (v) { p.description = v; }, "Description"),
    ed("input", p.details, function (v) { p.details = v; }, "Small grey line (technologies, features…)", "tags"));

  var col = el("div", "pcol"), tools = el("div", "tools"), handle = el("span", "handle", "⠿");
  handle.title = "Drag to reorder";
  tools.append(handle,
    btn("↑", function () { move(data.projects, pi, -1); }, "sm"),
    btn("↓", function () { move(data.projects, pi, 1); }, "sm"),
    btn(p.visible === false ? "Show" : "Hide", function () { p.visible = p.visible === false; changed(); }, "sm"),
    btn("Delete", function () {
      if (confirm("Delete project “" + p.title + "”?")) { data.projects.splice(pi, 1); changed(); }
    }, "sm danger"));
  col.append(
    line("Open", p.url, function (v) { p.url = v.trim(); }, "Live URL (https://…)"),
    line("Source", p.repo, function (v) { p.repo = v.trim(); }, "Source repo URL (optional)"),
    tools);
  row.append(h3, text, col);

  dragSource(row, handle, { pi: pi });
  row.addEventListener("dragover", function (e) {
    if (!drag) return;
    e.preventDefault(); e.stopPropagation(); clearMarks();
    var after = isAfter(e, row);
    row.classList.add(after ? "mark-after" : "mark-before");
    target = pi + (after ? 1 : 0);
  });
  row.addEventListener("drop", function (e) {
    if (!drag) return;
    e.preventDefault(); e.stopPropagation(); dropProject();
  });
  return row;
}

function mainBlock() {
  var m = el("main"), h2 = el("h2");
  h2.append(ed("input", data.projectsTitle || "Projects", function (v) { data.projectsTitle = v; }, "Section title"));
  var list = el("div"); list.id = "plist";
  data.projects.forEach(function (p, pi) { list.append(projectBlock(p, pi)); });
  if (!data.projects.length) {
    list.classList.add("empty-drop"); list.textContent = "No projects yet. Use + Add project.";
  }
  m.append(h2, list, btn("+ Add project", function () {
    data.projects.push({ title: "New project", description: "", details: "", url: "", repo: "", visible: true }); changed();
  }, "primary"));
  return m;
}

function footerBlock() {
  var f = data.footer, w = el("footer");
  w.append(
    line("Text", f.text, function (v) { f.text = v; }, "Footer link text"),
    line("Link", f.url, function (v) { f.url = v.trim(); }, "https://github.com/…"));
  return w;
}

function render() {
  var y = window.scrollY, box = $("editor");
  box.textContent = "";
  box.append(heroBlock(), mainBlock(), footerBlock());
  box.querySelectorAll("textarea").forEach(grow);
  window.scrollTo(0, y);
}

$("saveTok").onclick = function () {
  var t = $("tok").value.trim();
  if (!t) return say("Paste a token first.", "err");
  try { localStorage.setItem(KEY, t); } catch (e) { return say("Could not store the token in this browser.", "err"); }
  $("tok").value = ""; showToken(); load();
};
$("forget").onclick = function () {
  try { localStorage.removeItem(KEY); } catch (e) {}
  data = null; $("editor").textContent = ""; $("saveBar").hidden = true; showToken();
  say("Token removed from this device.", "ok");
};
$("reload").onclick = function () {
  if (dirty && !confirm("Discard unsaved edits and reload?")) return; load();
};
$("save").onclick = save;
showToken();
if (token()) load();
