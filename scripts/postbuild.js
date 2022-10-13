import fs from 'node:fs/promises'

await Promise.all([
  fs.copyFile('./assets/.nojekyll', './dist/.nojekyll'),
  fs.copyFile('./assets/CNAME', './dist/CNAME'),
])
