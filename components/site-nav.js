/* ==========================================================================
   COMPONENT — SITE NAV  <site-nav>
   Global header + mobile drawer. Rendered on every page from one file,
   so editing this changes the navigation site-wide.

   USAGE
     <site-nav></site-nav>                 default (solid header)
     <site-nav over-hero></site-nav>       transparent, light text over a
                                           dark hero image; goes solid on scroll

   Links come from window.OB.nav in js/site.config.js — add a page there,
   not here. Styles live in css/components.css.
   ========================================================================== */

(function () {
  "use strict";

  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function isActive(href) {
    return href === currentPage();
  }

  function logoMarkup(cfg, light) {
    var src = light && cfg.brand.logoSrcLight ? cfg.brand.logoSrcLight : cfg.brand.logoSrc;
    if (src) {
      return '<img class="site-logo__img" src="' + src + '" alt="' + cfg.brand.logoAlt + '">';
    }
    return '<span class="site-logo__word">' + cfg.brand.name + "</span>";
  }

  class SiteNav extends HTMLElement {
    connectedCallback() {
      var cfg = window.OB;
      if (!cfg) {
        console.error("[site-nav] window.OB missing — load js/site.config.js first.");
        return;
      }

      var overHero = this.hasAttribute("over-hero");

      var navLinks = cfg.nav
        .map(function (item) {
          return (
            '<a class="site-nav__link' + (isActive(item.href) ? " is-active" : "") + '" href="' +
            item.href + '"' + (isActive(item.href) ? ' aria-current="page"' : "") + ">" +
            item.label + "</a>"
          );
        })
        .join("");

      var drawerLinks = cfg.nav
        .map(function (item) {
          return (
            "<li><a class=\"nav-drawer__link" + (isActive(item.href) ? " is-active" : "") +
            '" href="' + item.href + '">' + item.label + "</a></li>"
          );
        })
        .join("");

      var cta = cfg.headerCta
        ? '<a class="btn btn--secondary btn--sm" href="' + cfg.headerCta.href + '">' +
          cfg.headerCta.label + "</a>"
        : "";

      this.innerHTML =
        '<a class="skip-link" href="#main">Skip to content</a>' +
        '<header class="site-header' + (overHero ? " site-header--over-hero" : " site-header--solid") +
          '" data-site-header>' +
          '<div class="container site-header__inner">' +
            '<a class="site-logo" href="index.html" aria-label="' + cfg.brand.name + ' — home">' +
              logoMarkup(cfg, overHero) +
            "</a>" +
            '<nav class="site-nav" aria-label="Primary">' + navLinks + "</nav>" +
            '<div class="site-header__actions">' + cta + "</div>" +
            '<button class="nav-toggle" type="button" aria-expanded="false" ' +
              'aria-controls="ob-drawer" aria-label="Open menu" data-nav-toggle>' +
              '<span class="nav-toggle__bar"></span>' +
              '<span class="nav-toggle__bar"></span>' +
              '<span class="nav-toggle__bar"></span>' +
            "</button>" +
          "</div>" +
        "</header>" +
        '<div class="nav-drawer" id="ob-drawer" data-nav-drawer hidden>' +
          '<nav aria-label="Mobile">' +
            '<ul class="nav-drawer__list">' + drawerLinks + "</ul>" +
          "</nav>" +
          '<div class="nav-drawer__foot">' +
            (cfg.contact.email
              ? '<a href="mailto:' + cfg.contact.email + '">' + cfg.contact.email + "</a>"
              : "") +
            (cfg.contact.phone
              ? '<a href="' + cfg.contact.phoneHref + '">' + cfg.contact.phone + "</a>"
              : "") +
            (cfg.headerCta
              ? '<a class="btn btn--primary" href="' + cfg.headerCta.href + '">' +
                cfg.headerCta.label + "</a>"
              : "") +
          "</div>" +
        "</div>";

      this.setupDrawer();
      this.setupScrollState();
    }

    setupDrawer() {
      var toggle = this.querySelector("[data-nav-toggle]");
      var drawer = this.querySelector("[data-nav-drawer]");
      var header = this.querySelector("[data-site-header]");
      if (!toggle || !drawer) return;

      // Drawer starts hidden from the a11y tree; unhide once JS is ready
      // so the transition has something to animate.
      drawer.hidden = false;

      var open = false;

      function setState(next) {
        open = next;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        drawer.classList.toggle("is-open", open);
        if (header) header.classList.toggle("is-drawer-open", open);
        document.body.classList.toggle("is-locked", open);
      }

      toggle.addEventListener("click", function () {
        setState(!open);
      });

      // Close when a link is tapped
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          setState(false);
        });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && open) {
          setState(false);
          toggle.focus();
        }
      });

      // If the viewport grows past the mobile breakpoint, reset
      window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
        if (e.matches && open) setState(false);
      });
    }

    setupScrollState() {
      var header = this.querySelector("[data-site-header]");
      if (!header) return;

      var threshold = 24;
      var ticking = false;

      function update() {
        header.classList.toggle("is-scrolled", window.scrollY > threshold);
        ticking = false;
      }

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
          }
        },
        { passive: true }
      );

      update();
    }
  }

  if (!customElements.get("site-nav")) {
    customElements.define("site-nav", SiteNav);
  }
})();
