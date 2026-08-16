/* ==========================================================================
   COMPONENT — SITE FOOTER  <site-footer>
   Global footer, rendered on every page from this one file. Built from the
   Figma footer (Draft 01 → Homepage- Design, node 2:57).

   THE LAYOUT
     top     "Back To The Top" on the left, Navigation and Links columns
             on the right
     middle  the full Olive Branch lockup, lower left
     bottom  a khaki panel holding the disclaimer, a hairline rule, and
             the policy links

   USAGE
     <site-footer></site-footer>

   Content comes from window.OB.footer in js/site.config.js.
   Styles live in the footer section of css/components.css.
   ========================================================================== */

(function () {
  "use strict";

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      var cfg = window.OB;
      if (!cfg) {
        console.error("[site-footer] window.OB missing — load js/site.config.js first.");
        return;
      }

      var f = cfg.footer;
      var icons = window.OB_ICONS || {};
      var year = new Date().getFullYear();

      var logoFile = cfg.brand.logoFooter || cfg.brand.logoSrcLight || cfg.brand.logoSrc;

      var columns = (f.columns || [])
        .map(function (col) {
          var links = col.links
            .map(function (l) {
              var attrs = l.external ? ' target="_blank" rel="noopener"' : "";
              return '<li><a href="' + l.href + '"' + attrs + ">" + l.label + "</a></li>";
            })
            .join("");
          return (
            '<div class="site-footer__col">' +
              '<h2 class="site-footer__title">' + col.title + "</h2>" +
              '<ul class="site-footer__list">' + links + "</ul>" +
            "</div>"
          );
        })
        .join("");

      var legal = (f.legal || [])
        .map(function (l) {
          return '<li><a href="' + l.href + '">' + l.label + "</a></li>";
        })
        .join("");

      this.innerHTML =
        '<footer class="site-footer">' +
          '<div class="container">' +

            /* ---- top row ---- */
            '<div class="site-footer__top">' +
              '<button class="site-footer__totop" type="button" data-back-to-top>' +
                '<span class="site-footer__totop-icon" aria-hidden="true">' +
                  (icons.arrowUp || icons.arrowDown || "") +
                "</span>" +
                "<span>" + (f.backToTop || "Back To The Top") + "</span>" +
              "</button>" +
              '<div class="site-footer__cols">' + columns + "</div>" +
            "</div>" +

            /* ---- brand lockup ---- */
            '<div class="site-footer__brand">' +
              (logoFile
                ? '<a href="index.html" aria-label="' + cfg.brand.name + ' — home">' +
                  '<img class="site-footer__logo" src="' + logoFile +
                  '" alt="' + cfg.brand.logoAlt + '"></a>'
                : '<a class="site-logo" href="index.html">' + cfg.brand.name + "</a>") +
            "</div>" +

            /* ---- disclaimer panel ---- */
            '<div class="site-footer__panel">' +
              '<p class="site-footer__disclaimer">' +
                (f.disclaimer || "") +
                ' <span class="site-footer__copy">&copy; ' + year + " " +
                (f.legalName || cfg.brand.name) + ". All rights reserved.</span>" +
              "</p>" +
              '<div class="site-footer__rule" role="presentation"></div>' +
              '<div class="site-footer__fine">' +
                '<ul class="site-footer__legal">' + legal + "</ul>" +
                (f.credit
                  ? '<p class="site-footer__credit"><a href="' + f.credit.href +
                    '" target="_blank" rel="noopener">' + f.credit.label + "</a></p>"
                  : "") +
              "</div>" +
            "</div>" +

          "</div>" +
        "</footer>";

      this.setupBackToTop();
    }

    setupBackToTop() {
      var btn = this.querySelector("[data-back-to-top]");
      if (!btn) return;

      btn.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }

  if (!customElements.get("site-footer")) {
    customElements.define("site-footer", SiteFooter);
  }
})();
