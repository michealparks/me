<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Portrait: THREE.Mesh
  }
  materials: object
}

const gltf = useGltf<GLTF>('/glb/picture.glb')

</script>

{#if $gltf}
  <T.Group
    name='Picture'
    scale={0.6}
    on:create={randomTransform}
  >
    <RigidBody
      type='dynamic'
      canSleep={false}
      {...randomVelocities()}
    >
      <AutoColliders shape='cuboid' mass={2} restitution={0.8}>
        <T is={$gltf.nodes.Portrait} castShadow receiveShadow />
      </AutoColliders>
    </RigidBody>
  </T.Group>
{/if}
