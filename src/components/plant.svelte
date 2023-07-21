<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Leaves: THREE.Mesh
    Pot: THREE.Mesh
    Soil: THREE.Mesh
  }
  materials: object
}

const gltf = useGltf<GLTF>('/glb/houseplant.glb')

</script>

{#if $gltf}
  <T.Group
    name='Plant'
    on:create={randomTransform}
  >
    <RigidBody
      type='dynamic'
      canSleep={false}
      {...randomVelocities()}
    >
      <AutoColliders mass={2} restitution={0.8}>
        <T is={$gltf.nodes.Leaves} castShadow receiveShadow />
        <T is={$gltf.nodes.Pot} castShadow receiveShadow />
      </AutoColliders>
      <T is={$gltf.nodes.Soil} castShadow receiveShadow />
    </RigidBody>
  </T.Group>
{/if}
