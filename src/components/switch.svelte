<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Body: THREE.Mesh
    LeftStick: THREE.Mesh
    RightStick: THREE.Mesh
    Pad: THREE.Mesh
    Screen: THREE.Mesh
    Button1: THREE.Mesh
    Button2: THREE.Mesh
    Button3: THREE.Mesh
    Button4: THREE.Mesh
    Button5: THREE.Mesh
    Button6: THREE.Mesh
  }
  materials: object
}

const gltf = useGltf<GLTF>('/glb/switch.glb')

</script>

{#if $gltf}
  <T.Group
    name='Switch'
    on:create={randomTransform}
  >
    <RigidBody
      type='dynamic'
      canSleep={false}
      {...randomVelocities()}
    >
      <AutoColliders mass={1.1} restitution={0.8}>
        <T is={$gltf.nodes.Body} castShadow receiveShadow />
        <T is={$gltf.nodes.LeftStick} castShadow receiveShadow />
        <T is={$gltf.nodes.RightStick} castShadow receiveShadow />
      </AutoColliders>
      <T is={$gltf.nodes.Pad} castShadow receiveShadow />
      <T is={$gltf.nodes.Screen} castShadow receiveShadow />
      <T is={$gltf.nodes.Button1} castShadow receiveShadow />
      <T is={$gltf.nodes.Button2} castShadow receiveShadow />
      <T is={$gltf.nodes.Button3} castShadow receiveShadow />
      <T is={$gltf.nodes.Button4} castShadow receiveShadow />
      <T is={$gltf.nodes.Button5} castShadow receiveShadow />
      <T is={$gltf.nodes.Button6} castShadow receiveShadow />
    </RigidBody>
  </T.Group>
{/if}
