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
import type { PipelineHook } from '@dimerapp/edge/types'

/**
 * The pipeline hook to use custom templates for certain
 * markdown nodes
 */
export const docsHook: PipelineHook = (node, pipeline) => {
  /**
   * Render pre element using a custom edge component
   */
  if (node.tagName === 'pre') {
    if (node.properties) {
      node.properties.style = ''
    }
    return pipeline.component('docs::elements/pre', { node })
  }

  if (!node.properties || !Array.isArray(node.properties.className)) {
    return
  }

  /**
   * Render codegroups using a custom component
   */
  if (node.properties.className.includes('codegroup')) {
    return pipeline.component('docs::elements/codegroup', { node })
  }

  /**
   * Render alerts using a custom component
   */
  if (node.properties.className.includes('alert')) {
    return pipeline.component('docs::elements/alert', { node })
  }

  /**
   * Render captions using a custom component
   */
  if (node.properties.className.includes('caption')) {
    return pipeline.component('docs::elements/caption', { node })
  }
}

/**
 * Edge plugin to mount the docs theme templates
 */
export function docsTheme(edge: Edge) {
  edge.mount('docs', fileURLToPath(new URL('./templates', import.meta.url)))
}
