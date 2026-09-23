/**
 * @file
 * Global utilities.
 *
 */
(function (Drupal) {
  'use strict';

  Drupal.behaviors.gndecNavigation = {
    attach: function (context) {
      // Target parent menu items inside main header/navigation
      var menuSelectors = [
        'header.bg-navy li',
        '.menu--main li',
        '.region-primary-menu li',
        '.primary-menu-wrapper li'
      ].join(', ');

      var parentMenuItems = context.querySelectorAll(menuSelectors);

      parentMenuItems.forEach(function (li) {
        var subMenu = li.querySelector('ul, .dropdown-menu');
        if (!subMenu) {
          return;
        }

        // Add class indicating this menu item has a submenu
        li.classList.add('has-submenu');

        var toggleLink = li.querySelector(':scope > a, :scope > span, :scope > button');
        if (!toggleLink) {
          return;
        }

        // Avoid attaching multiple click listeners if attached previously
        if (toggleLink.dataset.gndecSubmenuAttached) {
          return;
        }
        toggleLink.dataset.gndecSubmenuAttached = 'true';

        toggleLink.addEventListener('click', function (e) {
          var isMobile = window.innerWidth <= 991.98;
          var href = toggleLink.getAttribute('href');
          var isPlaceholder = !href || href === '#' || href.indexOf('javascript:') === 0;
          var isOpen = li.classList.contains('is-open') || li.classList.contains('open');

          // On mobile or if link is a placeholder: toggle submenu on click
          if (isMobile || isPlaceholder) {
            // If it's not open, or if it's a placeholder link, intercept click to toggle
            if (!isOpen || isPlaceholder) {
              e.preventDefault();
              e.stopPropagation();

              // Close other open submenus at the same level
              var siblings = li.parentNode ? li.parentNode.children : [];
              Array.prototype.forEach.call(siblings, function (sibling) {
                if (sibling !== li) {
                  sibling.classList.remove('is-open');
                  sibling.classList.remove('open');
                  var sibLink = sibling.querySelector(':scope > a');
                  if (sibLink) {
                    sibLink.setAttribute('aria-expanded', 'false');
                  }
                }
              });

              // Toggle this submenu
              if (isOpen) {
                li.classList.remove('is-open');
                li.classList.remove('open');
                toggleLink.setAttribute('aria-expanded', 'false');
              } else {
                li.classList.add('is-open');
                li.classList.add('open');
                toggleLink.setAttribute('aria-expanded', 'true');
              }
            }
          } else {
            // On desktop with real links, toggle class on click if needed
            if (!isOpen && !isPlaceholder) {
              li.classList.add('is-open');
              li.classList.add('open');
              toggleLink.setAttribute('aria-expanded', 'true');
            }
          }
        });
      });

      // Close submenus on click outside (only attach listener once)
      if (!document.body.dataset.gndecMenuClickOutsideAttached) {
        document.body.dataset.gndecMenuClickOutsideAttached = 'true';
        document.addEventListener('click', function (e) {
          if (!e.target.closest('header.bg-navy, .menu--main, .region-primary-menu, .primary-menu-wrapper')) {
            var openItems = document.querySelectorAll('header.bg-navy li.is-open, .menu--main li.is-open, .region-primary-menu li.is-open, .primary-menu-wrapper li.is-open, header.bg-navy li.open, .menu--main li.open, .region-primary-menu li.open, .primary-menu-wrapper li.open');
            openItems.forEach(function (openLi) {
              openLi.classList.remove('is-open');
              openLi.classList.remove('open');
              var link = openLi.querySelector(':scope > a');
              if (link) {
                link.setAttribute('aria-expanded', 'false');
              }
            });
          }
        });

        // Close submenus on Escape key
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            var openItems = document.querySelectorAll('header.bg-navy li.is-open, .menu--main li.is-open, .region-primary-menu li.is-open, .primary-menu-wrapper li.is-open, header.bg-navy li.open, .menu--main li.open, .region-primary-menu li.open, .primary-menu-wrapper li.open');
            openItems.forEach(function (openLi) {
              openLi.classList.remove('is-open');
              openLi.classList.remove('open');
              var link = openLi.querySelector(':scope > a');
              if (link) {
                link.setAttribute('aria-expanded', 'false');
              }
            });
          }
        });
      }
    }
  };
})(Drupal);

