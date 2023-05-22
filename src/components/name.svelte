<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { AutoColliders } from '@threlte/rapier'
import { Attractor } from '@threlte/rapier'

interface GLTF {
  nodes: {
    Title: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTF>('/glb/name.glb')

let clicked = false

</script>

<svelte:window
  on:pointerdown={() => (clicked = true)}
  on:pointerup={() => (clicked = false)}
/>

{#if $gltf}
  <AutoColliders>
    <T
      is={$gltf.nodes.Title}
      castShadow
      receiveShadow
    />
  </AutoColliders>
{/if}

{#if clicked}
  <Attractor
    range={40}
    strength={0.1}
  />
{/if}
