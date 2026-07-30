/* Veanora — static site scripts (vanilla JS, no jQuery) */
(function () {
  'use strict';

  // Sticky header shadow on scroll
  var header = document.getElementById('headerMain');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dynamic copyright year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Demo cart counter (placeholder e-commerce behaviour)
  var count = 0;
  var badge = document.querySelector('.cart-count');
  document.querySelectorAll('.product-actions .btn-luxe').forEach(function (btn) {
    btn.addEventListener('click', function () {
      count += 1;
      if (badge) badge.textContent = String(count);
      // GA4 / GTM ecommerce event
      window.dataLayer = window.dataLayer || [];
      var card = btn.closest('.product-card');
      window.dataLayer.push({
        event: 'add_to_cart',
        item_name: card ? card.querySelector('h3').textContent.trim() : 'unknown'
      });
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Added';
      setTimeout(function () { btn.innerHTML = '<i class="bi bi-bag"></i> Add to cart'; }, 1600);
    });
  });

  // Smooth-scroll offset compensation for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (document.querySelector('.site-header') || {}).offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset + 1, behavior: 'smooth' });
    });
  });
})();
