<script lang='ts'>

import { T } from '@threlte/core'

</script>

<T.AmbientLight />

<T.DirectionalLight
  castShadow
  normalBias={0.001}
  intensity={1.5}
  far={100}
  position={[-2, 4, -2]}
/>
