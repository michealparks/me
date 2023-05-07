<script lang='ts'>

import { useThrelte, useRender } from '@threlte/core'
import * as POST from 'postprocessing'

const { scene, renderer, camera } = useThrelte()

// To use the EffectComposer we need to pass arguments to the
// default WebGLRenderer: https://github.com/pmndrs/postprocessing#usage
const composer = new POST.EffectComposer(renderer)

const setupEffectComposer = (camera: THREE.Camera) => {
  composer.removeAllPasses()
  composer.addPass(new POST.RenderPass(scene, camera))
  composer.addPass(
    new POST.EffectPass(
      camera,
      new POST.BloomEffect({
        intensity: 0.4,
        luminanceThreshold: 0.15,
        height: 512,
        width: 512,
        luminanceSmoothing: 0.08,
        mipmapBlur: true,
        kernelSize: POST.KernelSize.MEDIUM
      })
    )
  )
  composer.addPass(
    new POST.EffectPass(
      camera,
      new POST.SMAAEffect({
        preset: POST.SMAAPreset.LOW
      })
    )
  )
}
// We need to set up the passes according to the camera in use
$: setupEffectComposer($camera)

useRender((_, delta) => composer.render(delta))

</script>
