<script lang='ts'>

import { useThrelte, useRender } from '@threlte/core'
import { HalfFloatType } from 'three'
import * as POST from 'postprocessing'

const { scene, renderer, camera } = useThrelte()

const composer = new POST.EffectComposer(renderer, { frameBufferType: HalfFloatType })

const setupEffectComposer = (camera: THREE.Camera) => {
  composer.removeAllPasses()

  composer.addPass(new POST.RenderPass(scene, camera))
  composer.addPass(
    new POST.EffectPass(
      camera,
      new POST.BloomEffect({
        intensity: 0.4,
        luminanceThreshold: 0.15,
        height: 256,
        width: 256,
        luminanceSmoothing: 0.08,
        mipmapBlur: true,
        kernelSize: POST.KernelSize.MEDIUM
      }),
      new POST.SMAAEffect({
        preset: POST.SMAAPreset.LOW
      })
    )
  )
}

$: setupEffectComposer($camera)

useRender((_, delta) => composer.render(delta))

</script>
