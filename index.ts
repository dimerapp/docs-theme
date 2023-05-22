/*
 * @dimerapp/docs-theme
 *
 * (c) DimerApp
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fileURLToPath } from 'node:url'
import type { EdgeContract } from 'edge.js'
import type { PipelineHook } from '@dimerapp/edge/types'

/**
 * The pipeline hook to use custom templates for certain
 * markdown nodes
 */
export const docsHook: PipelineHook = (node, pipeline) => {
  /**
   * Opening third-party URLs inside a new tab
   * Opening relative in-app URLs using unpoly.
   */
  if (node.tagName === 'a') {
    node.properties = node.properties || {}
    const url = node.properties.href
    if (typeof url !== 'string') {
      return
    }

    if (url.startsWith('https://') || url.startsWith('http://')) {
      node.properties.target = '_blank'
      node.properties.rel = 'noopener noreferrer'
    } else if (!url.startsWith('#')) {
      node.properties['up-target'] = '[layout-shell]'
      node.properties['up-preload'] = ''
    }
  }

  /**
   * Rendering tables using a custom component
   */
  if (node.tagName === 'table') {
    return pipeline.component('docs::elements/table', { node })
  }

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
export function docsTheme(edge: EdgeContract) {
  edge.mount('docs', fileURLToPath(new URL('./templates', import.meta.url)))
}
