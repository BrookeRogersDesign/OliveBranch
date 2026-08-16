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
    var panels = Array.prototype.slice.call(document.querySelectorAll(".stack-panel"));
    if (panels.length < 2) return;

    var ticking = false;

    function measure() {
      var vh = window.innerHeight;
      panels.forEach(function (panel) {
        var overflow = panel.offsetHeight - vh;
        // Taller than the screen → pin at the bottom, not the top
        panel.style.top = overflow > 0 ? -overflow + "px" : "0px";
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
        // How far the next panel's top edge has travelled up the screen
        var nextTop = next.getBoundingClientRect().top;
        var cover = 1 - Math.min(Math.max(nextTop / vh, 0), 1);
        panels[i].style.setProperty("--cover", cover.toFixed(3));
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
