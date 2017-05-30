const press = require('./util').press
const links = document.getElementsByClassName('nav__link')

let prevLink = document.getElementById('link-blog')
let prevSection = document.getElementById('section-blog')

for (let i = 0, l = links.length; i < l; ++i) {
  links[i].addEventListener(press, onLinkPress)
}

function onLinkPress (e) {
  if (e.currentTarget.id === prevLink.id) return

  const target = e.currentTarget
  const section = document.getElementById(target.id.replace('link', 'section'))

  target.classList.add('nav__link--active')
  prevLink.classList.remove('nav__link--active')

  section.classList.add('section--active')
  prevSection.classList.remove('section--active')

  prevLink = target
  prevSection = section
}
