
'use strict'

var Metalsmith   = require('metalsmith'),
    markdown     = require('metalsmith-markdown'),
    templates    = require('metalsmith-templates'),
    collections  = require('metalsmith-collections'),
    permalinks   = require('metalsmith-permalinks'),
    archive      = require('metalsmith-archive'),
    sass         = require('metalsmith-sass'),
    autoprefixer = require('metalsmith-autoprefixer')

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
  .build(function onError(err) {
    if (err) console.error(err)
  })

