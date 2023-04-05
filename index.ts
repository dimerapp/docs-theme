/*
 * @dimerapp/docs-theme
 *
 * (c) DimerApp
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Edge } from 'edge.js'
import { fileURLToPath } from 'node:url'
import { DimerEdgeRenderer } from '@dimerapp/edge'

/**
 * The edge renderer to use for rendering markdown elements
 */
export const docsRenderer = new DimerEdgeRenderer()
docsRenderer.use((node, renderer) => {
  /**
   * Render pre element using a custom edge component
   */
  if (node.tagName === 'pre') {
    if (node.properties) {
      node.properties.style = ''
    }
    return ['docs::elements/pre', { node, renderer }]
  }

  if (!node.properties || !Array.isArray(node.properties.className)) {
    return
  }

  /**
   * Render codegroups using a custom component
   */
  if (node.properties.className.includes('codegroup')) {
    return ['docs::elements/codegroup', { node, renderer }]
  }

  /**
   * Render alerts using a custom component
   */
  if (node.properties.className.includes('alert')) {
    return ['docs::elements/alert', { node, renderer }]
  }
})

/**
 * Edge plugin to mount the docs theme templates
 */
export function docsTheme(edge: Edge) {
  edge.mount('docs', fileURLToPath(new URL('./templates', import.meta.url)))
}
