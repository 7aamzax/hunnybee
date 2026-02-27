# Hunnybee – Spirits Catalog

A professional catalog site for premium cognac and spirits, with ordering via Instagram.

**GitHub Pages compatible:** All asset and link paths are relative, so the site works on both user/org Pages (`username.github.io`) and project Pages (`username.github.io/repo-name/`). No build step required.

- **Public catalog**: `index.html` – name, description, price, image, and “Share / Order on Instagram” button.
- **Admin**: `admin.html` – add, edit (photo, price, description, name), and delete items. Save by downloading `products.json` and updating the repo.

Instagram: [https://www.instagram.com/hannybiis?igsh=OWo5anFoZWpwN2Fp](https://www.instagram.com/hannybiis?igsh=OWo5anFoZWpwN2Fp)

---

## Run locally

1. Open the folder in your editor.
2. Use a simple local server (so `data/products.json` loads correctly):
   - **VS Code**: Install “Live Server” and right‑click `index.html` → “Open with Live Server”.
   - **Node**: run `npx serve .` in the project folder and open the URL shown.
3. Open `http://localhost:.../index.html` for the catalog and `admin.html` for the admin page.

---

## Deploy on GitHub (GitHub Pages)

1. **Create a new repo** on GitHub (e.g. `hannybiis` or `bii2`).

2. **Push this project** to the repo:
   ```bash
   cd path/to/hunnybee
   git init
   git add .
   git commit -m "Reserve Bar spirits catalog"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name.

3. **Turn on GitHub Pages**:
   - On the repo page, go to **Settings** → **Pages**.
   - Under **Source**, choose **Deploy from a branch**.
   - Branch: **main**, folder: **/ (root)**.
   - Save. After a minute, the site will be at:  
     `https://YOUR_USERNAME.github.io/YOUR_REPO/`

4. **Update the catalog from Admin**:
   - Open `https://YOUR_USERNAME.github.io/YOUR_REPO/admin.html`.
   - Add or edit items (name, description, price, image URL).
   - Click **“Download products.json”**.
   - In your repo, go to `data/products.json` → **Edit** → paste the new content (or upload the downloaded file to replace it) → **Commit**.
   - The live catalog will show the new products after the next Pages build.

---

## File structure

- `index.html` – Catalog (public).
- `admin.html` – Admin panel (add/edit/delete items).
- `404.html` – Custom 404 page (used by GitHub Pages for missing URLs).
- `.nojekyll` – Tells GitHub Pages to serve the site as static files (no Jekyll).
- `css/style.css` – Styles (dark + gold theme).
- `js/catalog.js` – Loads products and Instagram share.
- `js/admin.js` – Admin CRUD and download of `products.json`.
- `data/products.json` – Product list (edit in repo or via Admin + upload).

No backend or database required; GitHub Pages hosts everything.
