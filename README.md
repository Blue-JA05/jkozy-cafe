# ☁ JKozy Café ☕ website

A static, one-page site for the JKozy Café Discord server. Plain HTML, CSS, and JavaScript, so it runs on **GitHub Pages for free** with no build step.

```
index.html      the whole page
css/style.css   all styles (Fall + Christmas themes are the CSS variables at the top)
js/config.js    ⭐ invite link + server id live here
js/main.js      theme toggle, mobile menu, leaves/snow, live Discord counts
assets/         server icon, owner pfps, cat art (optimized .webp)
preview/        screenshots of the mockup (safe to delete before publishing)
```

## 1. The invite link

The permanent invite (`https://discord.gg/88upbJTbNf`) is already set in `js/config.js`:

```js
INVITE_LINK: "https://discord.gg/88upbJTbNf",
```

Every "Join the Café" button on the page uses this one setting. If you ever make a new invite, just swap it here
(in Discord: Invite People > Edit invite link > Expire After: **Never**, Max Uses: **No limit**).

## 2. Live online / member count

The hero shows a live "online now" number from Discord's server widget and a member count from your invite.
This needs **Server Settings > Widget > Enable Server Widget** turned ON (it is on right now).
If it's ever turned off, the site falls back to the `FALLBACK_MEMBERS` value in `js/config.js`.

## 3. Publish free on GitHub Pages

1. Make a GitHub account (free) and click **New repository**.
   - Name it `yourusername.github.io` to get `https://yourusername.github.io`, or any name (like `jkozy-cafe`) to get `https://yourusername.github.io/jkozy-cafe/`.
   - Set it to **Public**.
2. Click **Add file > Upload files** and drag in everything from this folder (`index.html`, `css`, `js`, `assets`, `README.md`). Commit.
3. Go to **Settings > Pages**. Under "Build and deployment", pick **Deploy from a branch**, branch **main**, folder **/ (root)**, and Save.
4. Wait a minute or two, refresh the Pages settings, and your link shows up at the top.

To update the site later, just upload the changed files again (or edit them right on GitHub). Pages redeploys on its own.

**Custom domain (optional):** buy a domain, then add it in Settings > Pages > Custom domain and follow GitHub's DNS steps.

## 4. Editing content

- Owner bios are in `index.html` inside the **Meet the Owners** section, marked with `DRAFT BIO` comments.
- Rules, channels, roles, ranks, and FAQ are plain HTML you can edit in any text editor.
- Theme colors: the `--variables` at the top of `css/style.css` (`[data-theme="fall"]` and `[data-theme="christmas"]`).
- To preview locally, open `index.html` in a browser (the live count works best when served, e.g. `python3 -m http.server` then open http://localhost:8000).
