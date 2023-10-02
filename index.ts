/*
 * @dimerapp/docs-theme
 *
 * (c) DimerApp
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Edge } from 'edge.js'
import type { PipelineHook } from '@dimerapp/edge/types'

/**
 * The pipeline hook to use custom templates for certain
 * markdown nodes
 */
export const docsHook: PipelineHook = (node, pipeline) => {
  if (node.tagName === 'disclosure') {
    return pipeline.component('docs::elements/disclosure', { node })
  }

  /**
   * Wrapping headings text inside a span
   */
  if (node.tagName === 'h2' || node.tagName === 'h3' || node.tagName === 'h4') {
    node.children = [
      node.children.shift()!,
      {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: node.children,
      },
    ]
  }

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

  /**
   * Processing include tag
   */
  if (node.tagName === 'include') {
    return pipeline.component('docs::elements/includes_partial', { node })
  }

  /**
   * Processing component tag. Assuming the template property
   * will be provided all the times
   */
  if (node.tagName === 'component') {
    return pipeline.component(node.properties!.template as string, { node })
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
  edge.mount('docs', new URL('./templates', import.meta.url))
}
