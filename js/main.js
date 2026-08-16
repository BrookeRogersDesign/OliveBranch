/* ==========================================================================
   OLIVE BRANCH — SITE INTERACTIONS
   Global behaviour shared by every page. Page-specific scripts, if any,
   go in js/pages/<page>.js and load after this file.

   CONTENTS
   1. Scroll reveal
   2. Accordions
   3. Inline icon rendering
   4. Forms (front-end validation + graceful no-backend handling)
   5. Viewport unit fix for mobile browser chrome
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
     5. MOBILE VIEWPORT HEIGHT
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
