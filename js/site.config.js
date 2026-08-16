/* ==========================================================================
   OLIVE BRANCH — SITE CONFIG
   The one place to edit navigation, contact details, and footer content.
   Change it here and every page updates, because the nav and footer
   components read from this object.

   ADDING A PAGE: add one entry to NAV below and create the .html file.
   Nothing else needs touching.
   ========================================================================== */

window.OB = {

  /* ---------- Brand ---------- */
  brand: {
    name: "Olive Branch",
    // Set logoSrc to a file in /assets/logos to swap the wordmark for artwork.
    // e.g. "assets/logos/olive-branch-wordmark.svg"
    logoSrc: null,
    logoSrcLight: null,      // light version for use on dark backgrounds
    logoAlt: "Olive Branch",
    tagline: "Thoughtful work, rooted in care."
  },

  /* ---------- Primary navigation ----------
     order = order shown. Every page in the site should appear here. */
  nav: [
    { label: "Home",     href: "index.html" },
    { label: "About",    href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Contact",  href: "contact.html" }
  ],

  /* ---------- Header call to action ---------- */
  headerCta: { label: "Get in touch", href: "contact.html" },

  /* ---------- Contact ---------- */
  contact: {
    email: "hello@olivebranch.com",
    phone: "",
    phoneHref: "",
    address: ""
  },

  /* ---------- Footer ---------- */
  footer: {
    blurb: "A short paragraph about Olive Branch — what it is, who it's for, and why it exists. Replace this with the real brand statement.",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Home",     href: "index.html" },
          { label: "About",    href: "about.html" },
          { label: "Services", href: "services.html" },
          { label: "Contact",  href: "contact.html" }
        ]
      },
      {
        title: "Connect",
        links: [
          { label: "hello@olivebranch.com", href: "mailto:hello@olivebranch.com" }
        ]
      }
    ],
    // icon must be one of the keys in OB_ICONS (js/icons.js)
    social: [
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "LinkedIn",  href: "#", icon: "linkedin" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms",          href: "#" }
    ],
    credit: { label: "Site by Brooke Rogers Design", href: "https://brookerogersdesign.com" }
  }
};
