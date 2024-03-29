# @dimerapp/docs-theme

<br />

[![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

The docs theme provides ready to use Edge templates, CSS and frontend JavaScript to create a documentation layout. This package must be used with [@dimerapp/content](https://github.com/dimerapp/content) package.

## Usage

Install the package from npm packages registry.

```sh
npm i @dimerapp/docs-theme
```

Register the `docsTheme` with the edge template engine. The `docsTheme` plugin registers a set of templates under the `docs` namespace.

Some of the templates relies on the `edge-uikit`. So make sure to also and configure the `edge-uikit`.

```ts
import { Edge } from 'edge.js'
import uiKit from 'edge-uikit'
import { docsTheme } from '@dimerapp/docs-theme'

const edge = new Edge()
edge.use(uiKit)
edge.use(docsTheme)
```

Once done, you use the following components to render the docs header, sidebar, table of contents and the main content.

```edge
@component('docs::header', config)
  @slot('logo')
    AdonisJS
  @end

  @slot('logoMobile')
    AdonisJS - Mobile logo
  @end
@end

<section layout-shell>
  @!component('docs::sidebar', {
    collapsible: true,
    sections: sidebarSections
  })

  <main layout-main>
    @!component('docs::content_header', { title: file.frontmatter.title })

    @component('docs::content')
      @!component('docs::doc_errors', { messages: file.messages })
      @!component('dimer_contents', { nodes: file.ast.children, pipeline })~
    @end

    @if(file.toc)
      @component('docs::toc')
        @!component('dimer_element', { node: file.toc, pipeline })~
      @end
    @end
  </main>
</section>
```

## Including styles and scripts

You may import the styles and scripts as follows.

```css
@import '@dimerapp/docs-theme/styles';
```

```js
import mediumZoom from 'medium-zoom'
import docsearch from '@docsearch/js'
import {
  initZoomComponent,
  initBaseComponents,
  initSearchComponent,
} from '@dimerapp/docs-theme/scripts'

Alpine.plugin(initBaseComponents)
Alpine.plugin(initSearchComponent(docsearch))
Alpine.plugin(initZoomComponent(mediumZoom))
```

[npm-image]: https://img.shields.io/npm/v/@dimerapp/docs-theme/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@dimerapp/docs-theme/v/latest 'npm'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/dimerapp/docs-theme?style=for-the-badge
