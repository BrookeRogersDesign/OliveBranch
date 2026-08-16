/* ==========================================================================
   COMPONENT — SITE FOOTER  <site-footer>
   Global footer, rendered on every page from one file.

   USAGE
     <site-footer></site-footer>

   Content comes from window.OB.footer in js/site.config.js.
   Styles live in css/components.css.
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

      var logo = cfg.brand.logoSrcLight || cfg.brand.logoSrc
        ? '<img class="site-logo__img" src="' +
          (cfg.brand.logoSrcLight || cfg.brand.logoSrc) +
          '" alt="' + cfg.brand.logoAlt + '">'
        : '<span class="site-logo__word">' + cfg.brand.name + "</span>";

      var columns = (f.columns || [])
        .map(function (col) {
          var links = col.links
            .map(function (l) {
              return '<li><a href="' + l.href + '">' + l.label + "</a></li>";
            })
            .join("");
          return (
            "<div>" +
              '<h2 class="site-footer__title">' + col.title + "</h2>" +
              '<ul class="site-footer__list">' + links + "</ul>" +
            "</div>"
          );
        })
        .join("");

      var social = (f.social || []).length
        ? '<ul class="site-footer__social">' +
          f.social
            .map(function (s) {
              return (
                '<li><a href="' + s.href + '" aria-label="' + s.label +
                '" target="_blank" rel="noopener">' + (icons[s.icon] || s.label) + "</a></li>"
              );
            })
            .join("") +
          "</ul>"
        : "";

      var legal = (f.legal || [])
        .map(function (l) {
          return '<a href="' + l.href + '">' + l.label + "</a>";
        })
        .join('<span aria-hidden="true"> · </span>');

      this.innerHTML =
        '<footer class="site-footer">' +
          '<div class="container">' +
            '<div class="site-footer__grid">' +
              '<div class="site-footer__brand">' +
                '<a class="site-logo" href="index.html">' + logo + "</a>" +
                '<p class="site-footer__blurb">' + (f.blurb || "") + "</p>" +
              "</div>" +
              columns +
              "<div>" +
                '<h2 class="site-footer__title">Follow</h2>' +
                social +
              "</div>" +
            "</div>" +
            '<div class="site-footer__bottom">' +
              "<p>&copy; " + year + " " + cfg.brand.name + ". All rights reserved.</p>" +
              "<p>" + legal + "</p>" +
              (f.credit
                ? '<p><a href="' + f.credit.href + '" target="_blank" rel="noopener">' +
                  f.credit.label + "</a></p>"
                : "") +
            "</div>" +
          "</div>" +
        "</footer>";
    }
  }

  if (!customElements.get("site-footer")) {
    customElements.define("site-footer", SiteFooter);
  }
})();
