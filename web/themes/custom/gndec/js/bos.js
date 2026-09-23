(function (Drupal) {
  'use strict';

  Drupal.behaviors.bosPageLinks = {
    attach: function (context) {
      context.querySelectorAll('.hero-banner .field__label, .bos-page-wrapper .field__label, .field__label').forEach(function (label) {
        label.style.display = 'none';
      });

      context.querySelectorAll('.heading-container').forEach(function (container) {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.textAlign = 'center';
        container.style.width = '100%';

        var textEl = container.querySelector('.heading-text');
        if (textEl) {
          textEl.style.color = '#b84018';
          textEl.style.fontSize = '2.25rem';
          textEl.style.fontWeight = '700';
          textEl.style.textTransform = 'uppercase';
          textEl.style.letterSpacing = '1.5px';
          textEl.style.textAlign = 'center';
        }

        var underlineEl = container.querySelector('.underline');
        if (underlineEl) {
          underlineEl.style.width = '50px';
          underlineEl.style.height = '3.5px';
          underlineEl.style.backgroundColor = '#b84018';
          underlineEl.style.margin = '6px auto 0 auto';
          underlineEl.style.borderRadius = '2px';
        }
      });

      // Process BOS Document Cards & Rows
      var cardSelectors = [
        '.doc-card',
        'div.doc-card',
        '.bos-document-card',
        '.bos-page-wrapper .views-row',
        '.view-bos .views-row',
        'body.path-bos .views-row'
      ].join(', ');

      var cards = Array.prototype.slice.call(context.querySelectorAll(cardSelectors));

      cards.forEach(function (card) {
        // Skip outer row wrapper if it contains an inner .doc-card
        if (card.querySelector('.doc-card')) {
          return;
        }

        // Apply flexbox container styles
        card.style.display = 'flex';
        card.style.flexDirection = 'row';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'space-between';
        card.style.width = '100%';
        card.style.maxWidth = '100%';

        // Look for PDF link inside card first
        var pdfLink = card.querySelector('a[href*=".pdf"], a[href*="files"], .views-field-field-document a, .views-field-file a, .field--name-field-document a');

        // If not found inside card, search anywhere in the main content container
        if (!pdfLink) {
          var mainWrapper = card.closest('.bos-page-wrapper') || card.closest('.main-content-blocks-wrapper') || document.body;
          pdfLink = mainWrapper.querySelector('a[href*=".pdf"], a[href*="files"], .field--name-field-document a, span.file a');
        }

        if (pdfLink) {
          // Identify wrapper to move (e.g. .views-field-field-document, .field--name-field-document, span.file, or link itself)
          var wrapperToMove = pdfLink.closest('.views-field-field-document, .views-field-file, .field--name-field-document, span.file') || pdfLink;

          // Append wrapper inside card at the end (far right side)
          card.appendChild(wrapperToMove);

          // Format link text cleanly as "View PDF ->"
          pdfLink.setAttribute('target', '_blank');
          pdfLink.setAttribute('rel', 'noopener noreferrer');
          pdfLink.innerHTML = 'View PDF &rarr;';
          pdfLink.style.display = 'inline-flex';
          pdfLink.style.alignItems = 'center';
          pdfLink.style.marginLeft = 'auto';
          pdfLink.style.whiteSpace = 'nowrap';
          pdfLink.style.fontWeight = '700';
          pdfLink.style.color = '#041e42';
          pdfLink.style.textDecoration = 'none';

          // Clean up inline icons, background images, and extra padding
          var fileSpan = pdfLink.closest('span.file, .file--mime-application-pdf, .file-link');
          if (fileSpan) {
            fileSpan.style.background = 'none';
            fileSpan.style.padding = '0';
            fileSpan.style.margin = '0';
            fileSpan.style.marginLeft = 'auto';
            fileSpan.querySelectorAll('img, svg, icon, .file-icon').forEach(function (ic) {
              ic.style.display = 'none';
            });
          }
        }

        // Add cursor pointer & click listener to card
        var targetLink = card.querySelector('a[href]');
        var hasValidHref = targetLink && targetLink.getAttribute('href') && targetLink.getAttribute('href') !== '#';

        if (hasValidHref) {
          card.style.cursor = 'pointer';
          card.classList.add('has-document');
        } else {
          card.style.cursor = 'default';
          card.classList.add('no-document');

          var docField = card.querySelector('.views-field-field-document, .views-field-file, .field--name-field-document');
          if (docField && !docField.querySelector('a')) {
            docField.innerHTML = '<span class="no-doc-text">No Document Attached</span>';
          }
        }

        if (!card.dataset.bosClickAttached) {
          card.dataset.bosClickAttached = 'true';
          card.addEventListener('click', function (event) {
            if (!event.target.closest('a')) {
              var link = card.querySelector('a[href]');
              if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
                window.open(link.getAttribute('href'), '_blank', 'noopener,noreferrer');
              }
            }
          });
        }
      });

      // Hide any remaining standalone raw file links/fields outside cards
      var mainWrapper = context.querySelector('.bos-page-wrapper') || document.body;
      mainWrapper.querySelectorAll('.field--type-file, .field--name-field-document, span.file, .file--mime-application-pdf, .file-link').forEach(function (el) {
        if (!el.closest('.doc-card') && !el.closest('.views-row')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
          el.style.opacity = '0';
        }
      });
    }
  };
})(Drupal);
