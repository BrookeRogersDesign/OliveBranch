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
    // Stacked OLIVE / BRANCH "written logo" (file 07), matching the Figma nav.
    //   logoSrc      = ink brown, for white grounds
    //   logoSrcLight = parchment, for the gradient hero and the open nav
    // Other lockups available in assets/logos/PNG/<colour>/:
    //   04 primary (mark + wordmark + tagline)   05 circular seal
    //   06 horizontal (wordmark + tagline)       07 written (stacked)
    //   08 branch mark only
    logoSrc:      "assets/logos/PNG/Ink%20Brown/OliveBranch-Branding(F)-07.png",
    logoSrcLight: "assets/logos/PNG/Parchment-%20Off%20White/OliveBranch-Branding(F)-07.png",
    // Full lockup used in the footer
    logoFooter:   "assets/logos/PNG/Parchment-%20Off%20White/OliveBranch-Branding(F)-04.png",
    logoAlt: "Olive Branch",
    tagline: "Thoughtful Accounting for Modern Life"
  },

  /* ---------- Menu pill label (from the Figma) ---------- */
  menuLabel: { closed: "Click To Expand", open: "Close" },

  /* ---------- Primary navigation ----------
     Labels and order match the Figma navigation. */
  nav: [
    { label: "Home",          href: "index.html" },
    { label: "Our Solutions", href: "solutions.html" },
    { label: "About Us",      href: "about.html" },
    { label: "Contact",       href: "contact.html" }
  ],

  /* ---------- Contact ---------- */
  contact: {
    email: "hello@olivebranch.com",   // placeholder — needs the real address
    phone: "",
    phoneHref: "",
    address: ""
  },

  /* ---------- Footer ----------
     Structure matches the Figma footer (node 2:57): back-to-top link and
     two link columns across the top, the full logo lockup lower left, and
     a khaki disclaimer panel across the bottom. */
  footer: {
    backToTop: "Back To The Top",

    columns: [
      {
        title: "Navigation",
        links: [
          { label: "Home",          href: "index.html" },
          { label: "Our Solutions", href: "solutions.html" },
          { label: "About Us",      href: "about.html" },
          { label: "Contact Us",    href: "contact.html" }
        ]
      },
      {
        title: "Links",
        links: [
          { label: "LinkedIn",       href: "#", external: true },
          { label: "Google Reviews", href: "#", external: true }
        ]
      }
    ],

    // Sits in the khaki panel at the foot of the page
    disclaimer: "Olive Branch Accounting provides tax preparation, tax planning, bookkeeping, consulting, and related accounting services to individuals and businesses. Information provided on this website is for general informational purposes only and should not be considered individualized tax, legal, or financial advice. Services and recommendations may vary based on each client's individual circumstances. Please consult with a qualified professional regarding your specific situation.",
    legalName: "Olive Branch Accounting",

    legal: [
      { label: "Privacy Policy",          href: "#" },
      { label: "Legal Disclosure",        href: "#" },
      { label: "Accessibility Statement", href: "#" }
    ],

    credit: { label: "Site by Brooke Rogers Design", href: "https://brookerogersdesign.com" }
  }
};
