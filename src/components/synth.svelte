<script lang='ts'>

import * as THREE from 'three'
import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Body: THREE.Mesh
    WhiteKeys: THREE.Mesh
    BlackKeys: THREE.Mesh
    Edges: THREE.Mesh
    Knobs: THREE.Mesh
    Dials: THREE.Mesh
    Screen: THREE.Mesh
  }
  materials: {
    ['Black Key']: THREE.MeshStandardMaterial
    ['White Key']: THREE.MeshStandardMaterial
    Wood: THREE.MeshStandardMaterial
    Button: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
  }
}

const gltf = useGltf<GLTF>('/glb/synth.glb')
  

</script>

{#if $gltf}
  <T.Group
    name='Synth'
    on:create={randomTransform}
  >
    <RigidBody
      type='dynamic'
      canSleep={false}
      {...randomVelocities()}
    >
      <AutoColliders mass={2} restitution={0.8}>
        <T is={$gltf.nodes.Edges} castShadow receiveShadow />
      </AutoColliders>
      <T is={$gltf.nodes.Body} castShadow receiveShadow />
      <T is={$gltf.nodes.WhiteKeys} castShadow receiveShadow />
      <T is={$gltf.nodes.BlackKeys} castShadow receiveShadow />
      <T is={$gltf.nodes.Knobs} castShadow receiveShadow />
      <T is={$gltf.nodes.Dials} castShadow receiveShadow />
      <T is={$gltf.nodes.Screen} castShadow receiveShadow />
    </RigidBody>
  </T.Group>
{/if}
