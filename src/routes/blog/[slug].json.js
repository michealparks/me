import posts from './_posts'

const lookup = new Map()

for (const post of posts) {
	lookup.set(post.slug, post)
}

export const get = (req, res) => {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params

	if (lookup.has(slug)) {
    res.json(lookup.get(slug))
	} else {
    res.json('{"message": "Not found"}')
	}
}
