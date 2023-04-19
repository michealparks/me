<script lang='ts'>

import { useThrelte } from '@threlte/core'
import { interactivity } from '@threlte/extras'
import Renderer from './renderer.svelte'
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

interactivity()

const { renderer } = useThrelte()

$: if (renderer) {
  renderer.debug.checkShaderErrors = import.meta.env.DEV
  renderer.setClearColor(0x020207)
}

</script>

<Renderer />

<Lights />
<Camera />
<Name />
<Synth />
<Plant />
<Picture />
<Switch />
<Legos />

<Colliders />

<Debug />
