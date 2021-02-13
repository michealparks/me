require('gh-pages').publish('dist', {
  dotfiles: true
}, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('Published')
  }
})
