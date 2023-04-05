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
    toggle() {
      this.active = !this.active
      if (this.active) {
        document.querySelector('body').style.overflow = 'hidden'
      } else {
        document.querySelector('body').style.overflow = 'initial'
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
}
