import marked from 'marked'
import { createFilter } from 'rollup-pluginutils'
import fm from 'front-matter'

export const md = (options = {}) => {
  const ext = /\.md$/
  const tabs = /^\t{3}/gm

  const filter = createFilter(options.include || ['**/*.md'], options.exclude)

  if (options.marked) {
    marked.setOptions(options.marked)
  }

  return {
    name: 'md',
    transform (md, id) {
      if (!ext.test(id) || !filter(id)) return null

      const data = fm(md)

      const result = {
        html: marked(data.body).replace(tabs, ''),
        ...data.attributes
      }

      return {
        code: `export default ${JSON.stringify(result)}`,
        map: { mappings: '' }
      }
    }
  }
}
