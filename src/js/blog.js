const marked = require('marked')
const press = require('./util').press

const blogList = document.getElementById('blog-list')
const postTitle = document.getElementsByClassName('post-title')
const blogPost = document.getElementById('blog-post')
const blogPostContent = document.getElementById('blog-post__content')

for (let i = 0, l = postTitle.length; i < l; ++i) {
  postTitle[i].addEventListener(press, onPostTitlePress)
}

document.getElementById('blog-post__back')
.addEventListener(press, function () {
  toggleBlogPostView(false)
})

function onPostTitlePress (e) {
  const url = e.currentTarget.getAttribute('data-file')

  getPost(url, function (err, html) {
    if (err) return

    toggleBlogPostView(true)

    blogPostContent.innerHTML = html
  })
}

function toggleBlogPostView (isActive) {
  blogList.classList.toggle('blog-list--active', !isActive)
  blogPost.classList.toggle('blog-post--active', isActive)
}

function getPost (url, next) {
  const xhr = new XMLHttpRequest()

  xhr.open('get', 'assets/posts/' + url)
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
