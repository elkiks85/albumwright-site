/* Applies assets/launch.js to every call to action.
 * The HTML ships in the beta state, so pages still work with JavaScript off. */
(function () {
  'use strict';
  var BETA_HREF = 'mailto:support@albumwright.com?subject=Albumwright%20beta';
  var BETA_LABEL = 'Join the private beta';
  var config = window.ALBUMWRIGHT_LAUNCH || {};
  var targets = {
    store:   { key: 'chromeStoreUrl',     label: 'Add to Chrome' },
    monthly: { key: 'checkoutMonthlyUrl', label: 'Buy Pro monthly' },
    yearly:  { key: 'checkoutYearlyUrl',  label: 'Buy Pro yearly' },
    helper:  { key: 'helperDownloadUrl',  label: 'Download the helper' }
  };

  function launchUrl(value) {
    if (typeof value !== 'string') return '';
    value = value.trim();
    return /^https:\/\/[^\s"'<>]+$/i.test(value) ? value : '';
  }

  var links = document.querySelectorAll('[data-cta]');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var target = targets[link.getAttribute('data-cta')];
    if (!target) continue;
    var url = launchUrl(config[target.key]);
    var label = link.querySelector('[data-cta-label]') || link;
    if (url) {
      link.href = url;
      link.rel = 'noopener';
      label.textContent = link.getAttribute('data-live-label') || target.label;
      link.setAttribute('data-state', 'live');
    } else {
      link.href = BETA_HREF;
      link.removeAttribute('rel');
      label.textContent = link.getAttribute('data-beta-label') || BETA_LABEL;
      link.setAttribute('data-state', 'beta');
    }
  }

  // Two checkout buttons that both fall back to the beta email become one button.
  var pairs = document.querySelectorAll('[data-cta-pair]');
  for (var p = 0; p < pairs.length; p++) {
    var buttons = pairs[p].querySelectorAll('[data-cta]');
    var allBeta = true;
    for (var b = 0; b < buttons.length; b++) if (buttons[b].getAttribute('data-state') !== 'beta') allBeta = false;
    for (var c = 1; c < buttons.length; c++) buttons[c].hidden = allBeta;
  }

  // Copy that differs before and after the Chrome Web Store listing exists.
  document.documentElement.setAttribute('data-launch', launchUrl(config.chromeStoreUrl) ? 'live' : 'beta');

  // Sections rise into place as they scroll into view. With reduced motion, or without
  // IntersectionObserver, everything is simply visible.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) document.documentElement.classList.add('no-reveal');
  else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var items = document.querySelectorAll('.reveal');
    for (var r = 0; r < items.length; r++) observer.observe(items[r]);
  }

  // The small-screen menu closes once a link in it is chosen, so it doesn't cover the section it jumped to.
  var menu = document.querySelector('details.menu');
  if (menu) menu.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('a')) menu.removeAttribute('open');
  });
})();
