/* ☁ JKozy Café ☕ site script. Vanilla JS, no build step. */
(function () {
  "use strict";
  var CFG = window.KOZY_CONFIG || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Invite links ---------- */
  var invite = (CFG.INVITE_LINK || "#INVITE-LINK").trim();
  var invitePlaceholder = !/^https?:\/\//i.test(invite);
  document.querySelectorAll("[data-invite]").forEach(function (a) {
    a.setAttribute("href", invite);
    if (invitePlaceholder) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        toast("Invite link coming soon!! (set INVITE_LINK in js/config.js)");
      });
    } else {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
  });

  /* ---------- Toast ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2800);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  function closeNav() { navLinks.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); }
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          var on = l.getAttribute("href") === "#" + en.target.id;
          l.classList.toggle("active", on);
          if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute("href")); if (s) spy.observe(s); });

    /* Reveal-on-scroll */
    if (!reduceMotion) {
      var rev = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".menu-card, .role-card, .step, .gem, .event-card, .rule, .owner-card, .ladder, .regular-card").forEach(function (el) {
        el.classList.add("reveal"); rev.observe(el);
      });
    }
  }

  /* ---------- Theme toggle (Fall <-> Christmas) ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var THEMES = {
    fall: { icon: "🍂", label: "Fall", next: "christmas", color: "#5a3522" },
    christmas: { icon: "🎄", label: "Christmas", next: "fall", color: "#0f3d24" }
  };
  function applyTheme(name, save) {
    var t = THEMES[name] ? name : "fall";
    root.setAttribute("data-theme", t);
    themeBtn.querySelector(".tt-icon").textContent = THEMES[t].icon;
    themeBtn.querySelector(".tt-label").textContent = THEMES[t].label;
    themeBtn.setAttribute("aria-pressed", t === "christmas" ? "true" : "false");
    themeBtn.setAttribute("aria-label", "Theme: " + THEMES[t].label + ". Switch to " + THEMES[THEMES[t].next].label);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEMES[t].color);
    if (save) { try { localStorage.setItem("kozy-theme", t); } catch (e) {} }
    makeParticles(t);
  }
  themeBtn.addEventListener("click", function () {
    applyTheme(THEMES[root.getAttribute("data-theme")] ? THEMES[root.getAttribute("data-theme")].next : "christmas", true);
  });

  /* ---------- Drifting leaves / snow ---------- */
  var box = document.querySelector(".particles");
  function makeParticles(theme) {
    box.innerHTML = "";
    if (reduceMotion) return;
    var isSnow = theme === "christmas";
    var count = isSnow ? (window.innerWidth < 640 ? 18 : 34) : (window.innerWidth < 640 ? 6 : 11);
    var leaves = ["🍂", "🍁", "🍂"];
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "particle " + (isSnow ? "snow" : "leaf");
      if (isSnow) {
        var size = 3 + Math.random() * 6;
        p.style.width = p.style.height = size + "px";
        p.style.borderRadius = "50%";
        p.style.background = "#fff";
        p.style.boxShadow = "0 0 3px rgba(60,90,70,.55)";
        p.style.setProperty("--spin", "0deg");
        p.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
        p.style.animationDuration = (8 + Math.random() * 10) + "s";
      } else {
        p.textContent = leaves[i % leaves.length];
        p.style.fontSize = (14 + Math.random() * 12) + "px";
        p.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
        p.style.setProperty("--spin", (Math.random() > 0.5 ? "" : "-") + (180 + Math.random() * 360) + "deg");
        p.style.setProperty("--drift", (Math.random() * 160 - 40) + "px");
        var d = 14 + Math.random() * 12;
        p.style.animationDuration = d + "s, " + (3 + Math.random() * 3) + "s";
        p.style.animationTimingFunction = "linear, ease-in-out";
      }
      p.style.left = (Math.random() * 100) + "vw";
      p.style.animationDelay = (-Math.random() * 20) + "s";
      box.appendChild(p);
    }
  }
  applyTheme(root.getAttribute("data-theme"), false);

  /* ---------- Live Discord counts ---------- */
  // Online count: Discord's public widget (needs "Enable Server Widget" ON).
  // Member count: Discord's public invite lookup (approximate_member_count).
  var onlineEl = document.getElementById("stat-online");
  var membersEl = document.getElementById("stat-members");
  function fallback() {
    onlineEl.parentElement.hidden = true;
    membersEl.textContent = CFG.FALLBACK_MEMBERS || "~78";
  }
  function inviteCode(url) {
    var m = /(?:discord\.gg|discord(?:app)?\.com\/invite)\/([\w-]+)/i.exec(url || "");
    return m ? m[1] : null;
  }
  function loadMembers(code) {
    if (!code) return;
    fetch("https://discord.com/api/v10/invites/" + encodeURIComponent(code) + "?with_counts=true")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (typeof d.approximate_member_count === "number") membersEl.textContent = d.approximate_member_count.toLocaleString();
      })
      .catch(function () {});
  }
  if (CFG.GUILD_ID && window.fetch) {
    fetch("https://discord.com/api/guilds/" + encodeURIComponent(CFG.GUILD_ID) + "/widget.json")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (typeof d.presence_count === "number") onlineEl.textContent = d.presence_count.toLocaleString();
        else onlineEl.parentElement.hidden = true;
        // Prefer your own invite for the member count, else the widget's temporary one.
        loadMembers(inviteCode(invitePlaceholder ? "" : invite) || inviteCode(d.instant_invite));
      })
      .catch(function () {
        fallback();
        if (!invitePlaceholder) loadMembers(inviteCode(invite));
      });
  } else {
    fallback();
  }
})();
