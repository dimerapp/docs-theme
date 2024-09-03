/*
 * @dimerapp/docs-theme
 *
 * (c) DimerApp
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Scroll the active sidebar item into the view on page load
 */
const activeSidebarItem = document.querySelector('.docs_sidebar a.up-current')
if (activeSidebarItem) {
  activeSidebarItem.scrollIntoView({
    block: 'center',
  })
}

/**
 * @param {import('alpinejs').default} Alpine
 */
export function initBaseComponents(Alpine) {
  /**
   * Dark mode store is used to toggle the dark mode
   * across the app
   */
  Alpine.store('darkMode', {
    enabled: Alpine.$persist(true).as('darkMode_enabled'),
    enable() {
      this.enabled = true
    },
    disable() {
      this.enabled = false
    },
    toggle() {
      this.enabled = !this.enabled
    },
  })

  /**
   * Offcanvas menu store
   */
  Alpine.store('offcanvasMenu', {
    active: false,
    hide() {
      if (this.active) {
        this.active = false
        document.querySelector('body').style.overflow = 'initial'
      }
    },
    show() {
      if (!this.active) {
        this.active = true
        document.querySelector('body').style.overflow = 'hidden'
      }
    },
    toggle() {
      if (this.active) {
        this.hide()
      } else {
        this.show()
      }
    },
  })

  /**
   * Popup menu
   */
  Alpine.store('popupMenu', {
    active: false,
    hide() {
      if (this.active) {
        this.active = false
        document.querySelector('body').style.overflow = 'initial'
      }
    },
    show() {
      if (!this.active) {
        this.active = true
        document.querySelector('body').style.overflow = 'hidden'
      }
    },
    toggle() {
      if (this.active) {
        this.hide()
      } else {
        this.show()
      }
    },
  })

  /**
   * Codegroups tabs manager listens for tab switch and animates
   * the highlighter
   */
  Alpine.data('codegroupTabsWrapper', function () {
    return {
      animateHighlighter(activeTab, highlighter) {
        highlighter.style.left = `${activeTab.offsetLeft}px`
        highlighter.style.width = `${activeTab.clientWidth}px`
      },

      init() {
        this.$nextTick(() => {
          const activeTab = this.$root.querySelector('button[aria-selected="true"]')
          const highlighter = this.$root.querySelector('.highlighter')
          if (activeTab && highlighter) {
            this.animateHighlighter(activeTab, highlighter)
          }
        })
      },
      onChange() {
        if (this.$data.$refs.highlighter && this.$data.selectedTrigger) {
          this.animateHighlighter(this.$data.selectedTrigger, this.$data.$refs.highlighter)
        }
      },
    }
  })

  /**
   * Component to copy code block to clipboard
   */
  Alpine.data('copyCodeToClipboard', function () {
    return {
      state: 'idle',
      copy() {
        this.state = 'copied'
        const code = this.$root.querySelector('pre code').textContent
        navigator.clipboard.writeText(code)

        setTimeout(() => {
          this.state = 'idle'
        }, 1500)
      },
    }
  })

  /**
   * Tracks the scrolling of windows and activates the
   * hash link next to it.
   */
  Alpine.data('trackScroll', function () {
    return {
      scrollListener: null,

      setActiveTableOfContents(scrollContainerIntoView) {
        const links = Array.from(this.$el.querySelectorAll('a'))

        let lastVisible =
          links
            .slice()
            .reverse()
            .find((link) => {
              const el = document.querySelector(decodeURIComponent(link.hash))
              return el.getBoundingClientRect().top <= 100
            }) ?? links[0]

        links.forEach((link) => {
          if (link === lastVisible) {
            link.classList.add('up-current')
            if (scrollContainerIntoView) {
              link.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
              })
            }
          } else {
            link.classList.remove('up-current')
          }
        })
      },

      init() {
        this.scrollListener = function () {
          this.setActiveTableOfContents(false)
        }.bind(this)

        this.$nextTick(() => {
          this.setActiveTableOfContents(true)
          window.addEventListener('scroll', this.scrollListener, { passive: true })
        })
      },

      destroy() {
        window.removeEventListener('scroll', this.scrollListener)
      },
    }
  })
}

/**
 * Initiate search plugin
 */
export function initSearchComponent(docsearch) {
  /**
   * @param {import('alpinejs').default} Alpine
   */
  return function (Alpine) {
    /**
     * Search widget
     */
    Alpine.data('search', function (options) {
      return {
        init() {
          docsearch({
            container: this.$el,
            appId: options.appId,
            indexName: options.indexName,
            apiKey: options.apiKey,
          })
        },
      }
    })
  }
}

/**
 * Initiate image zoom plugin
 */
export function initZoomComponent(mediumZoom) {
  /**
   * @param {import('alpinejs').default} Alpine
   */
  return function (Alpine) {
    /**
     * Search widget
     */
    Alpine.data('zoom', function () {
      return {
        zoom: null,
        init() {
          this.zoom = mediumZoom(this.$root.querySelector('img'))
        },
        destroy() {
          if (this.zoom) {
            this.zoom.detach()
          }
        },
      }
    })
  }
}
