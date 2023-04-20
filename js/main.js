/*
 * @dimerapp/docs-theme
 *
 * (c) DimerApp
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @param {import('alpinejs').default} Alpine
 */
export default function (Alpine) {
  /**
   * Dark mode store is used to toggle the dark mode
   * across the app
   */
  Alpine.store('darkMode', {
    enabled: Alpine.$persist(true).as('darkMode_enabled'),
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
              const el = document.querySelector(link.hash)
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
        console.log('removing scroll listener')
        window.removeEventListener('scroll', this.scrollListener)
      },
    }
  })
}

/**
 * Initiate search plugin
 */
export const initSearch = (docsearch) => {
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
