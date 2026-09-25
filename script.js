/* Eternity Permits & Design — interactions */
(function () {
  "use strict";

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var targets = links
    .map(function (l) {
      return document.querySelector(l.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive() {
    var pos = window.scrollY + 140;
    var current = targets[0];
    targets.forEach(function (t) {
      if (t.offsetTop <= pos) current = t;
    });
    links.forEach(function (l) {
      l.classList.toggle("is-active", current && l.getAttribute("href") === "#" + current.id);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) {
      cio.observe(c);
    });
  }

  /* ---------- misc ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();
