<script lang='ts'>

import { T } from '@threlte/core'

</script>

<T.AmbientLight />

<T.DirectionalLight
  castShadow
  normalBias={0.1}
  intensity={4}
  far={50}
  position={[-2, 4, -2]}
/>

<T.SpotLight
  castShadow
  color='#b54546'
  intensity={120}
  normalBias={0.1}
  position={[5, 4, 5]}
/>
