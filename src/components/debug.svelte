<script lang='ts'>

import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { onDestroy, onMount } from 'svelte'
import { useThrelte, useFrame } from '@threlte/core'
import { Debug } from '@threlte/rapier'
import Inspector from 'three-inspect'

const stats = new Stats()
const { start, stop } = useFrame(() => stats.update(), { autostart: false })

const debug = false
const physicsDebug = localStorage.getItem('debug_physics')
const depth = true

const { scene, camera, renderer } = useThrelte()

onMount(() => {
  document.body.append(stats.dom)
  start()

  if (debug) {
    new Inspector({
      scene,
      camera: camera.current as THREE.PerspectiveCamera,
      renderer,
      options: { location: 'overlay' },
    })
  }
})

onDestroy(() => {
  stop()
  stats.dom.remove()
})

</script>

{#if physicsDebug}
  <Debug depthTest={depth} depthWrite={depth} />
{/if}
