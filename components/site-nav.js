/* ==========================================================================
   COMPONENT — SITE NAV  <site-nav>
   Global header + full-screen navigation overlay, built from the Figma
   file (Draft 01 → "Menu- Open Naviagtion", node 1:3).

   THE PATTERN
     Default    stacked OLIVE BRANCH wordmark top-left,
                a khaki "Click To Expand" pill top-right with a plus mark
     Open       full-screen gradient ground with a large white rounded
                panel on the right holding the four links, the legal
                links, LinkedIn, and a Close control

   The pill is a single toggle. It sits where the Figma's Close control
   sits, so opening and closing happen from one place: the plus rotates
   into a cross and the label switches to "Close". Escape, clicking the
   gradient outside the panel, and Cmd/Ctrl + K also close it.

   USAGE
     <site-nav></site-nav>            over a light page
     <site-nav over-hero></site-nav>  light marks over a dark hero

   Links come from window.OB in js/site.config.js — add a page there, not
   here. Styles live in the navigation section of css/components.css.
   ========================================================================== */

(function () {
  "use strict";

  function currentPage() {
    // The single-file preview build sets this so the active link still
    // highlights when there's no real URL to read. Harmless in production.
    if (window.OB_PREVIEW_PAGE) return window.OB_PREVIEW_PAGE;
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function isActive(href) {
    return href === currentPage();
  }

  /* Renders both logo files stacked so they can cross-fade between the
     light and dark header states. Falls back to a type lockup if no
     logo is configured in js/site.config.js. */
  function logoMarkup(cfg) {
    var b = cfg.brand;
    if (b.logoSrc) {
      return (
        '<span class="site-logo__stack">' +
          '<img class="site-logo__img site-logo__img--dark" src="' + b.logoSrc +
            '" alt="' + b.logoAlt + '">' +
          (b.logoSrcLight
            ? '<img class="site-logo__img site-logo__img--light" src="' +
              b.logoSrcLight + '" alt="" aria-hidden="true">'
            : "") +
        "</span>"
      );
    }
    var parts = cfg.brand.name.split(" ");
    return (
      '<span class="wordmark">' +
        parts.map(function (w) {
          return '<span class="wordmark__line">' + w + "</span>";
        }).join("") +
      "</span>"
    );
  }

  class SiteNav extends HTMLElement {
    connectedCallback() {
      var cfg = window.OB;
      if (!cfg) {
        console.error("[site-nav] window.OB missing — load js/site.config.js first.");
        return;
      }

      var overHero = this.hasAttribute("over-hero");
      var icons = window.OB_ICONS || {};
      var labels = cfg.menuLabel || { closed: "Menu", open: "Close" };

      var panelLinks = cfg.nav
        .map(function (item) {
          return (
            "<li>" +
              '<a class="nav-panel__link' + (isActive(item.href) ? " is-active" : "") +
              '" href="' + item.href + '"' +
              (isActive(item.href) ? ' aria-current="page"' : "") + ">" +
              item.label +
            "</a></li>"
          );
        })
        .join("");

      var legal = (cfg.footer.legal || [])
        .map(function (l) {
          return '<li><a href="' + l.href + '">' + l.label + "</a></li>";
        })
        .join("");

      // The panel's bottom-right links reuse the footer's "Links" column
      // (LinkedIn, Google Reviews) so there is one list to maintain.
      var linksCol = (cfg.footer.columns || []).filter(function (col) {
        return col.title === "Links";
      })[0];
      var social = ((linksCol && linksCol.links) || cfg.footer.social || [])
        .map(function (s) {
          return '<li><a href="' + s.href + '" target="_blank" rel="noopener">' +
                 s.label + "</a></li>";
        })
        .join("");

      this.innerHTML =
        '<a class="skip-link" href="#main">Skip to content</a>' +

        '<header class="site-header' + (overHero ? " site-header--over-hero" : "") +
          '" data-site-header>' +
          '<div class="container site-header__inner">' +
            '<a class="site-logo" href="index.html" aria-label="' + cfg.brand.name + ' — home">' +
              logoMarkup(cfg) +
            "</a>" +
            '<button class="menu-pill" type="button" aria-expanded="false" ' +
              'aria-controls="ob-nav-panel" data-nav-toggle>' +
              '<span class="menu-pill__icon" aria-hidden="true">' + (icons.plus || "+") + "</span>" +
              '<span class="menu-pill__label" data-menu-label>' + labels.closed + '</span>' +
            "</button>" +
          "</div>" +
        "</header>" +

        '<div class="nav-overlay" id="ob-nav-panel" role="dialog" aria-modal="true" ' +
          'aria-label="Site navigation" data-nav-overlay>' +
          '<div class="nav-overlay__panel">' +
            /* No Close button here — the header pill sits in exactly this
               spot and becomes the Close control, as it does in the Figma. */
            '<nav class="nav-panel" aria-label="Primary">' +
              '<ul class="nav-panel__list">' + panelLinks + "</ul>" +
            "</nav>" +

            '<div class="nav-overlay__foot">' +
              '<ul class="nav-overlay__legal">' + legal + "</ul>" +
              '<ul class="nav-overlay__social">' + social + "</ul>" +
            "</div>" +
          "</div>" +
        "</div>";

      this.setupOverlay();
      this.setupScrollState();
    }

    setupOverlay() {
      var toggle = this.querySelector("[data-nav-toggle]");
      var overlay = this.querySelector("[data-nav-overlay]");
      var header = this.querySelector("[data-site-header]");
      var label = this.querySelector("[data-menu-label]");
      var labels = (window.OB && window.OB.menuLabel) || { closed: "Menu", open: "Close" };
      if (!toggle || !overlay) return;

      var open = false;
      var self = this;

      function setState(next) {
        open = next;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (label) label.textContent = open ? labels.open : labels.closed;
        overlay.classList.toggle("is-open", open);
        if (header) header.classList.toggle("is-nav-open", open);
        document.body.classList.toggle("is-locked", open);

        if (open) {
          var first = overlay.querySelector(".nav-panel__link");
          if (first) first.focus({ preventScroll: true });
        }
      }

      toggle.addEventListener("click", function () { setState(!open); });
      // Clicking the gradient area outside the panel closes it
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) setState(false);
      });

      overlay.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { setState(false); });
      });

      // Keyboard: Cmd/Ctrl + K toggles the menu from anywhere on the page
      document.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          setState(!open);
          if (!open) toggle.focus();
        }
      });

      document.addEventListener("keydown", function (e) {
        if (!open) return;

        if (e.key === "Escape") {
          setState(false);
          toggle.focus();
          return;
        }

        // Keep tab focus inside the panel while it's open
        if (e.key === "Tab") {
          var focusable = overlay.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable.length) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });

      this.closeNav = function () { setState(false); };
      void self;
    }

    setupScrollState() {
      var header = this.querySelector("[data-site-header]");
      if (!header) return;

      // Over a full-bleed hero the header stays transparent until the hero
      // has scrolled past — flipping it to white at 24px would put a white
      // stripe over the gradient. Elsewhere it solidifies immediately.
      var hero = this.hasAttribute("over-hero")
        ? document.querySelector(".home-hero, [data-hero]")
        : null;
      var threshold = 24;
      var ticking = false;

      function measure() {
        threshold = hero
          ? Math.max(hero.offsetHeight - header.offsetHeight * 1.2, 24)
          : 24;
      }

      function update() {
        header.classList.toggle("is-scrolled", window.scrollY > threshold);
        ticking = false;
      }

      window.addEventListener("resize", function () {
        measure();
        update();
      }, { passive: true });

      measure();

      window.addEventListener("scroll", function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });

      update();
    }
  }

  if (!customElements.get("site-nav")) {
    customElements.define("site-nav", SiteNav);
  }
})();
