<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Lego: THREE.Mesh
  }
  materials: object
}

const length = 40

// https://materialui.co/flatuicolors
const colors = [
  0x1A_BC_9C,
  0x34_98_DB,
  0x9B_59_B6,
  0xF1_C4_0F,
  0xF3_9C_12,
  0xE7_4C_3C,
  0x2C_3E_50,
  0xEC_F0_F1,
]

const material = (index: number) => {
  const mat = ($gltf!.nodes.Lego.material as THREE.MeshStandardMaterial).clone()
  mat.color.set(colors[index % colors.length]!)
  return mat
}

const gltf = useGltf<GLTF>('/glb/lego.glb')

</script>

{#if $gltf}
  {#each Array.from({length}) as _, index (index)}
    <T.Group
      name='Lego-{index}'
      on:create={randomTransform}
    >
      <RigidBody
        type='dynamic'
        canSleep={false}
        {...randomVelocities()}
      >
        <AutoColliders shape='cuboid' mass={1} restitution={0.8}>
          <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.Lego.geometry}
            material={material(index)}
          />
        </AutoColliders>
      </RigidBody>
    </T.Group>
  {/each}
{/if}
