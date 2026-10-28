# Visualizing Proximity: portfolio with admin page

Static page (plain HTML/CSS/JS, no build step). The text content now lives in `portfolio.js`; `script.js` draws it into `index.html`.

## Files
- `index.html`, `style.css`, `script.js`: the public page
- `portfolio.js`: all editable content (title, intro, projects, footer link)
- `admin.html`, `admin.js`, `admin.css`: editing page, opened from the **⚙ Admin** button at the top right of the site
- The schematic figure (the two dense/sparse panels) stays inside `index.html`; the admin page cannot edit it.

## 1. Upload
In the `Portfolio` repo on github.com: **Add file → Upload files**, drag in everything from this folder (replace `index.html` and `style.css`), **Commit changes** on `main`. The site is then at `https://victorreyesgit.github.io/Portfolio/` and the admin at `.../Portfolio/admin.html`.

If your repo or branch has another name, change `REPO` / `BRANCH` at the top of `admin.js`.

## 2. Token: reuse the one from the Home hub
`admin.js` uses the same browser storage key as the Home hub admin, and both sites live on `victorreyesgit.github.io`, so a token saved in one admin is found automatically by the other. The only catch is that a fine-grained token is tied to specific repositories, so the token made for `Home` cannot write to `Portfolio` yet (the admin will show a 404).

Pick one:
- **Extend the existing token:** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → your `projects-hub-admin` token → **Edit** → Repository access → add `Portfolio` → save. Keep **Contents: Read and write**. If GitHub does not let you change it, use the next option.
- **New token for both repos:** generate a new one (same steps as before: resource owner `victorreyesgit`, short expiry, Only select repositories → `Home` **and** `Portfolio`, Contents: Read and write) and paste it into either admin page. The other admin will pick it up on the same browser.

## 3. Use the admin page
1. Open the admin (button on the site), paste the token if asked, **Save token and load**.
2. Click any text to edit it in place: title, "by" text, intro sentence, note, section title, each project's name, description, small grey line, URLs, footer link.
3. Reorder projects by dragging **⠿** (or **↑ ↓** on touch screens); **Hide / Show** and **Delete** per project; **+ Add project** at the end.
4. **Save to GitHub**. The site updates about a minute later. If it says the file changed on GitHub meanwhile, click **Reload from GitHub** and redo the edit; nothing is overwritten.

## Editing by hand
Open `portfolio.js` on github.com and edit. Keep valid JSON (double quotes, no trailing commas) and keep the line `window.PORTFOLIO = {`.

## Security notes
Same as the Home hub: the token sits unencrypted in `localStorage`, and every page on `victorreyesgit.github.io` shares that storage, so use a short expiry and **Forget token** on shared computers. A leaked token can only write to the repos it was granted. `admin.html` has a Content-Security-Policy limiting network calls to `api.github.com`.
