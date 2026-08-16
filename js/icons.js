/* ==========================================================================
   OLIVE BRANCH — INLINE ICON SET
   Inline SVG so icons inherit color and need no extra requests.
   Add new icons here; use with OB_ICONS.name or <span data-icon="name">.
   Standalone SVG files (illustrations, brand marks) go in /assets/icons.
   ========================================================================== */

window.OB_ICONS = {

  /* Plus mark used by the menu pill and the panel's Close control */
  plus: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M7 .8v12.4M.8 7h12.4"/></svg>',

  close: '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1.4 1.4l11.2 11.2M12.6 1.4L1.4 12.6"/></svg>',

  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',

  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20V5M6 11l6-6 6 6"/></svg>',

  arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg>',

  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 20c0-8 5-13 16-14 0 10-5 15-13 15H4z"/><path d="M4 20C8 15 12 12 17 10"/></svg>',

  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',

  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9.75h4v11.25H3zM10 9.75h3.83v1.54h.05c.53-.95 1.83-1.96 3.77-1.96 4.03 0 4.78 2.5 4.78 5.76V21h-4v-4.98c0-1.19-.02-2.72-1.7-2.72-1.7 0-1.96 1.29-1.96 2.63V21h-4z"/></svg>',

  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V5.5h-3c-2.3 0-4 1.9-4 4.2V12H7.5v3.5H10V22h3.5v-6.5H16L16.5 12H13.5v-2c0-.6.4-1 .5-1z"/></svg>',

  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>',

  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>',

  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>'
};

/* Replaces <span data-icon="leaf"></span> with the inline SVG. */
window.OB_renderIcons = function (root) {
  (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
    var name = el.getAttribute("data-icon");
    if (window.OB_ICONS[name] && !el.dataset.iconRendered) {
      el.innerHTML = window.OB_ICONS[name];
      el.dataset.iconRendered = "true";
    }
  });
};
