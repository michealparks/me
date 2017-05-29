const marked = require('marked')
const press = window.ontouchend === undefined ? 'click' : 'touchend'
const postList = document.getElementsByClassName('post-title')
const blogPost = document.getElementById('blog-post__content')

for (let i = 0, l = postList.length; i < l; ++i) {
  postList[i].addEventListener(press, onPostListPress)
}

document.getElementById('blog-post__back')
.addEventListener(press, function () {
  toggleBlogPostView(false)
})

function onPostListPress (e) {
  const url = e.currentTarget.getAttribute('data-file')

  getPost(url, function (err, html) {
    if (err) return

    toggleBlogPostView(true)

    blogPost.innerHTML = html
  })
}

function toggleBlogPostView (isActive) {
  document.getElementById('blog-list')
  .classList.toggle('blog-list--active', !isActive)
  document.getElementById('blog-post')
  .classList.toggle('blog-post--active', isActive)
}

function getPost (url, next) {
  const xhr = new XMLHttpRequest()

  xhr.open('get', `assets/posts/${url}`)
  xhr.responseType = 'text'
  xhr.timeout = 10000

  xhr.onload = function () {
    marked(xhr.response, next)
  }

  xhr.onerror = xhr.ontimeout = function (err) {
    next(err)
  }

  xhr.send()
}
