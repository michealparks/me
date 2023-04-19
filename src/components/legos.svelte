<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { RigidBody, AutoColliders } from '@threlte/rapier'
import { randomTransform, randomVelocities } from '../util'

interface GLTF {
  nodes: {
    Lego: THREE.Mesh
  }
  materials: {}
}

const length = 40

// https://materialui.co/flatuicolors
const colors = [
  0x1ABC9C,
  0x3498DB,
  0x9B59B6,
  0xF1C40F,
  0xF39C12,
  0xE74C3C,
  0x2C3E50,
  0xECF0F1,
]

const material = (index: number) => {
  const mat = ($gltf!.nodes.Lego.material as THREE.MeshStandardMaterial).clone()
  mat.color.set(colors[index % colors.length]!)
  return mat
}

const gltf = useGltf<GLTF>('/glb/lego.glb')

</script>

{#if $gltf}
  {#each Array.from({ length }) as _, index (index)}
    <T.Group
      name='Lego-{index}'
      on:create={randomTransform}
    >
      <RigidBody
        type='dynamic'
        canSleep={false}
        {...randomVelocities()}
      >
        <AutoColliders shape='cuboid' mass={1}>
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
