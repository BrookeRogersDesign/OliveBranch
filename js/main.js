/* ==========================================================================
   OLIVE BRANCH — SITE INTERACTIONS
   Global behaviour shared by every page. Page-specific scripts, if any,
   go in js/pages/<page>.js and load after this file.

   CONTENTS
   1. Scroll reveal
   2. Accordions
   3. Inline icon rendering
   4. Forms (front-end validation + graceful no-backend handling)
   5. Gradient parallax
   6. Stacking scroll (sections pin and layer over one another)
   7. Hero pin (gradient drift while the hero is pinned)
   8. Viewport unit fix for mobile browser chrome
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     1. SCROLL REVEAL
     Any element with data-reveal fades up the first time it enters
     the viewport. Stagger siblings with data-reveal-delay="1..5".
     --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     2. ACCORDIONS
     <div class="accordion">
       <div class="accordion__item">
         <button class="accordion__trigger" aria-expanded="false">…</button>
         <div class="accordion__panel"><div><div class="accordion__body">…</div></div></div>
       </div>
     </div>
     Add data-single to the .accordion to allow only one open at a time.
     --------------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll(".accordion").forEach(function (group) {
      var single = group.hasAttribute("data-single");

      group.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var item = trigger.closest(".accordion__item");
          var isOpen = item.classList.contains("is-open");

          if (single) {
            group.querySelectorAll(".accordion__item.is-open").forEach(function (other) {
              if (other !== item) {
                other.classList.remove("is-open");
                other.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
              }
            });
          }

          item.classList.toggle("is-open", !isOpen);
          trigger.setAttribute("aria-expanded", String(!isOpen));
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     3. ICONS
     --------------------------------------------------------------- */
  function initIcons() {
    if (window.OB_renderIcons) window.OB_renderIcons(document);
  }

  /* ---------------------------------------------------------------
     4. FORMS
     Client-side validation + a friendly message. Point the form's
     action at a real endpoint (Formspree, Netlify, etc.) when the
     client's backend is chosen; until then it shows a local success
     state instead of navigating away.
     --------------------------------------------------------------- */
  function initForms() {
    document.querySelectorAll("form[data-ob-form]").forEach(function (form) {
      var status = form.querySelector(".form__status");

      form.addEventListener("submit", function (e) {
        var valid = true;

        form.querySelectorAll("[required]").forEach(function (input) {
          var field = input.closest(".field");
          var ok = input.checkValidity() && input.value.trim() !== "";
          if (field) field.classList.toggle("has-error", !ok);
          if (!ok) valid = false;
        });

        if (!valid) {
          e.preventDefault();
          if (status) {
            status.textContent = "Please fill in the highlighted fields.";
            status.setAttribute("data-state", "error");
          }
          return;
        }

        // No endpoint wired up yet — don't navigate to a dead page.
        if (!form.getAttribute("action")) {
          e.preventDefault();
          if (status) {
            status.textContent = "Thank you — your message has been received.";
            status.setAttribute("data-state", "success");
          }
          form.reset();
        }
      });

      // Clear the error state as soon as the person starts fixing it
      form.querySelectorAll("input, textarea, select").forEach(function (input) {
        input.addEventListener("input", function () {
          var field = input.closest(".field");
          if (field) field.classList.remove("has-error");
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     5. PARALLAX
     Any element with data-parallax drifts vertically as its section
     scrolls past. data-parallax-speed sets how much (0 = pinned to
     the page, 1 = would scroll twice as fast). Runs on rAF, only
     while the element is on screen, and switches itself off for
     prefers-reduced-motion.
     --------------------------------------------------------------- */
  function initParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!layers.length || prefersReducedMotion) return;

    // Each layer is positioned inside its section; the section is what we
    // watch, the layer is what we move.
    var pairs = layers.map(function (layer) {
      return {
        layer: layer,
        host: layer.parentElement,
        speed: parseFloat(layer.getAttribute("data-parallax-speed")) || 0.3,
        active: true
      };
    });

    var ticking = false;

    function update() {
      for (var i = 0; i < pairs.length; i++) {
        var p = pairs[i];
        if (!p.active) continue;
        var top = p.host.getBoundingClientRect().top;
        p.layer.style.transform = "translate3d(0," + (-top * p.speed).toFixed(2) + "px,0)";
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    // Stop doing work for sections that are off screen
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          pairs.forEach(function (p) {
            if (p.host === entry.target) p.active = entry.isIntersecting;
          });
        });
        update();
      }, { rootMargin: "200px 0px" });

      pairs.forEach(function (p) { io.observe(p.host); });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     6. STACKING SCROLL
     Each .stack-panel pins at the top of the viewport while the next
     one scrolls up and covers it. Two jobs here:

     1. Panels TALLER than the viewport get a negative sticky top, so
        they scroll fully into view and pin at their own bottom edge
        rather than pinning immediately and hiding their lower half.
        (This can't be pure CSS — a percentage `top` on a sticky element
        resolves against the .stack container, not the panel.)

     2. Each panel gets --cover, 0 → 1, describing how far the next
        panel has slid over it. The CSS uses that to shade and ease
        back the covered panel, which is what makes it read as a stack.
     --------------------------------------------------------------- */
  function initStackingScroll() {
    var stack = document.querySelector(".stack");
    var panels = Array.prototype.slice.call(document.querySelectorAll(".stack-panel"));
    if (!stack || panels.length < 2) return;

    var header = document.querySelector("[data-site-header]");
    if (header) header.classList.add("has-stack");

    var ticking = false;
    var peek = 0;

    function readPeek() {
      var raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--stack-peek");
      var n = parseFloat(raw);
      return isNaN(n) ? 18 : n;
    }

    /* How much extra scroll length an extended panel carries, as a multiple
       of the viewport height. Lives in tokens.css as --hero-extend so the
       amount — and switching it off on small screens, where a long hero just
       means more scrolling to get anywhere — stays a CSS decision. */
    function extendFor(panel) {
      if (!panel.hasAttribute("data-stack-extend")) return 0;
      var raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--hero-extend");
      var n = parseFloat(raw);
      return isNaN(n) || n < 0 ? 0 : n;
    }

    function measure() {
      var vh = window.innerHeight;
      peek = readPeek();

      // The deck starts below the header, so a band of the first panel is
      // always visible behind it. Two things fall out of that: the header
      // marks never fight the content, because no panel can ever pin above
      // the header; and the brand gradient stays on screen as a top edge.
      var headerH = header ? header.offsetHeight : 0;

      // Pass one: work out where each card pins, and size it to fill exactly
      // the space below that pin. Without this a panel set to a full 100vh
      // would always overflow its slot and get pulled back up to the top,
      // collapsing the peek and flattening the deck.
      panels.forEach(function (panel, i) {
        // Panel 0 sits flush at the top. Every panel after it pins a little
        // lower than the one before, leaving a sliver of each showing.
        var pin = i === 0 ? 0 : headerH + peek * (i - 1);
        panel.dataset.pin = String(pin);
        // A panel marked data-stack-extend carries scroll length beyond the
        // slot it displays in, so it holds on screen longer before the next
        // card starts covering it. It shows its own .__stage; the extra
        // height below that is only ever scrolled through, never seen.
        panel.style.minHeight =
          Math.max(vh - pin, 320) + extendFor(panel) * vh + "px";
      });

      // Pass two, once those heights have applied: a card whose content is
      // taller than its slot gets pulled up by the difference, so it scrolls
      // fully into view and settles with its bottom at the viewport edge.
      panels.forEach(function (panel) {
        var pin = parseFloat(panel.dataset.pin) || 0;

        // An extended panel must NOT be pulled up — its extra height is
        // deliberate scroll length, not content waiting to be read. Pulling
        // it up would drag the headline off the top of the screen.
        if (extendFor(panel) > 0) {
          panel.style.top = pin + "px";
          return;
        }

        var overflow = panel.offsetHeight - (vh - pin);
        panel.style.top = (pin - Math.max(overflow, 0)) + "px";
      });

      update();
    }

    function update() {
      var vh = window.innerHeight;

      for (var i = 0; i < panels.length; i++) {
        var next = panels[i + 1];
        if (!next) {
          panels[i].style.setProperty("--cover", "0");
          continue;
        }
        var nextTop = next.getBoundingClientRect().top;
        var cover = 1 - Math.min(Math.max(nextTop / vh, 0), 1);
        panels[i].style.setProperty("--cover", cover.toFixed(3));
      }

      updateHeaderTheme();
      ticking = false;
    }

    /* Whichever panel is sitting under the header decides whether the logo
       and pill render light or dark. Without this the marks would fight the
       stacked slivers as they pass behind the header. */
    function updateHeaderTheme() {
      if (!header) return;

      var probeY = header.offsetHeight * 0.55;
      var onDark = false;
      var running = false;

      // Later panels paint over earlier ones, so the last one reaching the
      // header band is the one actually visible there.
      for (var i = 0; i < panels.length; i++) {
        var r = panels[i].getBoundingClientRect();

        if (r.top <= probeY && r.bottom > 0) {
          onDark = panels[i].dataset.panelTheme === "dark";
        }

        // A panel taller than the screen has to travel up past the header to
        // be read in full, and its copy would run behind the logo while it
        // does. Whenever anything is sitting above the top of the screen and
        // still crossing the header band, the header takes a solid backdrop.
        // With the deck settled nothing qualifies, so the backdrop drops away
        // and the stacked card edges show through again.
        if (r.top < -1 && r.bottom > probeY) running = true;
      }

      header.classList.toggle("is-on-dark", onDark);
      header.classList.toggle("has-backdrop", running);
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    // Fonts and images change panel heights, so re-measure once settled
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener("load", measure);

    measure();
  }

  /* ---------------------------------------------------------------
     7. HERO PIN
     The hero is the first panel in the stack, so while it's pinned its
     own rect stops moving and the generic parallax engine has nothing
     to work with. Its gradient drift is driven from scroll position
     directly instead. The copy fade is handled by --cover in CSS.
     --------------------------------------------------------------- */
  function initHeroPin() {
    var hero = document.querySelector(".home-hero");
    if (!hero) return;

    var gradient = hero.querySelector("[data-hero-gradient]");
    var height = hero.offsetHeight;
    var ticking = false;

    function measure() {
      height = hero.offsetHeight || 1;
      update();
    }

    function update() {
      var progress = Math.min(Math.max(window.scrollY / height, 0), 1);

      if (gradient && !prefersReducedMotion) {
        // Gradient sinks slightly as the white section climbs over it
        gradient.style.transform =
          "translate3d(0," + (progress * height * 0.16).toFixed(2) + "px,0)";
      }

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", measure, { passive: true });
    measure();
  }

  /* ---------------------------------------------------------------
     8. MOBILE VIEWPORT HEIGHT
     iOS/Android browser chrome makes 100vh taller than the visible
     area. Use height: calc(var(--vh, 1vh) * 100) instead of 100vh.
     --------------------------------------------------------------- */
  function initViewportUnit() {
    function setVh() {
      document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    }
    setVh();
    window.addEventListener("resize", setVh, { passive: true });
    window.addEventListener("orientationchange", setVh);
  }

  /* ---------------------------------------------------------------
     Boot
     --------------------------------------------------------------- */
  function init() {
    initViewportUnit();
    initIcons();
    initReveal();
    initAccordions();
    initForms();
    initParallax();
    initStackingScroll();
    initHeroPin();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
