<script lang='ts'>

import { T } from '@threlte/core'
import { Collider } from '@threlte/rapier'

const size = 10
const depth = 0.1

const colliders: {
  position: [x: number, y: number, z: number]
  args: [x: number, y: number, z: number]
}[] = [
  // left, right
  { position: [-size, 0, 0], args: [depth, size, size] },
  { position: [+size, 0, 0], args: [depth, size, size] },
  // back, front
  { position: [0, 0, -size], args: [size, size, depth] },
  { position: [0, 0, +size], args: [size, size, depth] },
  // bottom, top
  { position: [0, -size, 0], args: [size, depth, size] },
  { position: [0, +size, 0], args: [size, depth, size] },
]

</script>

{#each colliders as { position, args }}
  <T.Group {position}>
    <Collider shape='cuboid' {args} />
  </T.Group>
{/each}
