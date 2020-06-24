import posts from './_posts/index.js'

const contents = posts.map(post => {
  return {
    title: post.title,
    slug: post.slug
  }
})

export const get = (req, res) => {
  res.json(contents)
}
