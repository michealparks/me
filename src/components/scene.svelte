<script lang='ts'>

import * as THREE from 'three'
import { useThrelte } from '@threlte/core'
import Composer from './composer.svelte'
import Lights from './lights.svelte'
import Camera from './camera.svelte'
import Name from './name.svelte'
import Synth from './synth.svelte'
import Plant from './plant.svelte'
import Picture from './picture.svelte'
import Switch from './switch.svelte'
import Legos from './legos.svelte'
import Debug from './debug.svelte'
import Colliders from './colliders.svelte'

const { renderer } = useThrelte()

$: if (renderer) {
  renderer.debug.checkShaderErrors = import.meta.env.DEV
  renderer.setClearColor(0x020207)
  renderer.outputColorSpace = THREE.SRGBColorSpace
}


</script>

<Composer />

<Lights />
<Camera />
<Name />
<Synth />
<Plant />
<Picture />
<Switch />
<Legos />

<Colliders />

{#if import.meta.env.DEV}
  <Debug />
{/if}
