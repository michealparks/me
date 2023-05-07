import { promisify } from 'node:util'
import { exec as _exec } from 'node:child_process'

const exec = promisify(_exec)

const models = [
  'synth',
  // 'male',
]

for (const model of models) {
  // let pack = `npx gltfpack -i public/glb/${model}.glb -o public/glb/${model}.glb`
  // console.log(pack)
  // await exec(pack)

  let cmd = `npx @threlte/gltf@1.0.0-next.12 assets/glb/${model}.glb`
  cmd += ` --output src/models/${model}.svelte`
  cmd += ' --types'
  cmd += ' --keepnames'
  cmd += ' --meta'
  cmd += ' --shadows'
  cmd += ' --debug'
  console.log(cmd)
  await exec(cmd)
}
