/* Outside In — interactions
   Lightweight, dependency-free, reduced-motion aware. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: translucent-on-scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var body = document.body;
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close when a link is tapped
    document.querySelectorAll(".mobile-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("menu-open")) {
        body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // Stagger siblings that share a [data-reveal-group] parent
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      var kids = group.querySelectorAll("[data-reveal]");
      kids.forEach(function (kid, i) {
        if (!kid.style.getPropertyValue("--reveal-delay")) {
          kid.style.setProperty("--reveal-delay", (i * 90) + "ms");
        }
      });
    });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Highlight today's row in hours tables ---------- */
  // data-day: 0=Sun ... 6=Sat  (rows may cover ranges via data-days="1-6")
  var today = new Date().getDay();
  document.querySelectorAll("[data-days]").forEach(function (row) {
    var range = row.getAttribute("data-days").split("-").map(Number);
    var inRange = range.length === 2
      ? (today >= range[0] && today <= range[1])
      : range[0] === today;
    if (inRange) row.classList.add("today");
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
