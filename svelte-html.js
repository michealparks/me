// import 'svelte/register'
import fs from 'fs'

const document = (head, html, meta) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, width=device-width">
        <meta name="theme-color" content="#000000">
        <meta property="og:url" content="${meta.url}">

        <meta property="og:title" content="${meta.title}">
        <meta name="twitter:title" content="${meta.title}">
        <title>${meta.title}</title>

        ${meta.article ? '<meta property="og:type" content="article">' : ''}

        <meta property="og:image" content="profile.jpg">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="profile.jpg">
        
        <meta name="description" content="${meta.description}">
        <meta property="og:description" content="${meta.description}">
        <meta name="twitter:description" content="${meta.description}">
        <meta name="twitter:site" content="@godisacomputer">
        <link href="index.xml" type="application/atom+xml" rel="alternate" title="Sitewide Atom feed">
        ${head}
        <link href="https://fonts.googleapis.com/css?family=Comfortaa|Nunito|Roboto+Mono&display=swap&effect=anaglyph" rel="stylesheet">
        <link rel="stylesheet" href="main.css" />
      </head>
      <body>
        ${html}
        <script type="module">
          import('./main.js').then(module => new module.default({
            target: document.body,
            hydrate: true
          })) 
        </script>
      </body>
    </html>
  `
}

export const svelteHTML = () => {
  return {
    name: 'svelte-html',
    writeBundle: () => {
      for (const module of Object.keys(require.cache)) {
        if (/main-server/.test(require.cache[module].filename)) {
          console.log(module)
          delete require.cache[module]
        }
      }

      const App = require('./dist/main-server.js')
      const { html, head } = App.render()

      fs.writeFileSync('./dist/index.html', document(head, html, {
        title: 'Micheal Parks',
        description: 'Developer.'
      }), 'utf-8')

      console.log('Updated HTML.')
    }
  }
}
