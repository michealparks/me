
'use strict'

var Metalsmith   = require('metalsmith'),
    markdown     = require('metalsmith-markdown'),
    templates    = require('metalsmith-templates'),
    collections  = require('metalsmith-collections'),
    permalinks   = require('metalsmith-permalinks'),
    archive      = require('metalsmith-archive'),
    sass         = require('metalsmith-sass'),
    autoprefixer = require('metalsmith-autoprefixer'),
    highlight    = require('metalsmith-code-highlight')

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(collections({
    pages: {
      pattern: 'pages/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  // .use(archive({
  //   collections: 'pages'
  // }))
  .use(markdown())
  .use(templates('jade'))
  .use(sass({
    sourceMap: true,
    sourceMapContents: true
  }))
  .use(autoprefixer())
  .use(highlight())
  .build(function onError(err) {
    if (err) console.error(err)
  })

