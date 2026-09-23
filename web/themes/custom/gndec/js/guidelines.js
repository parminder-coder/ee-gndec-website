(function (Drupal) {
  'use strict';

  Drupal.behaviors.guidelinesPdfOpening = {
    attach: function (context) {
      // Process PDF Document Cards & Views Rows
      var cardSelectors = [
        '.guidelines-page-wrapper .doc-card',
        '.guidelines-page-wrapper div.doc-card',
        '.guidelines-page-wrapper .guidelines-card',
        '.guidelines-page-wrapper .views-row',
        'body.path-guidelines .views-row',
        'body.path-academics-guidelines .views-row'
      ].join(', ');

      context.querySelectorAll(cardSelectors).forEach(function (card) {
        // Look for valid PDF / File link inside card
        var pdfLink = card.querySelector('a[href*=".pdf"], a[href*="files"], a[href]:not([href="#"])');

        if (pdfLink && pdfLink.getAttribute('href') && pdfLink.getAttribute('href') !== '#') {
          pdfLink.setAttribute('target', '_blank');
          pdfLink.setAttribute('rel', 'noopener noreferrer');
          card.style.cursor = 'pointer';

          // Ensure link wrapper is visible
          var linkWrapper = pdfLink.closest('.views-field-field-document, .views-field-file, .field--name-field-document, .link-wrapper');
          if (linkWrapper) {
            linkWrapper.style.display = 'inline-flex';
          }
        } else {
          // If no PDF file is attached, hide any empty View PDF link wrappers inside card
          card.querySelectorAll('.views-field-field-document, .views-field-file, .field--name-field-document, .link-wrapper, .view-pdf-link, a').forEach(function (wrapper) {
            wrapper.style.display = 'none';
            wrapper.style.visibility = 'hidden';
          });
          card.style.cursor = 'default';
        }

        // Add card click listener to open PDF in a new tab if user clicks anywhere on card
        if (!card.dataset.guidelinesPdfClickAttached) {
          card.dataset.guidelinesPdfClickAttached = 'true';
          card.addEventListener('click', function (event) {
            if (!event.target.closest('a')) {
              var link = card.querySelector('a[href*=".pdf"], a[href*="files"], a[href]:not([href="#"])');
              if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
                window.open(link.getAttribute('href'), '_blank', 'noopener,noreferrer');
              }
            }
          });
        }
      });
    }
  };
})(Drupal);
