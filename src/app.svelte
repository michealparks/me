<script lang='ts'>

import { Canvas } from '@threlte/core'
import { World } from '@threlte/rapier'
import Scene from './components/scene.svelte'

</script>

<Canvas
  dpr={1.7}
  useLegacyLights={false}
  rendererParameters={{
    alpha: false,
  }}
>
  <World gravity={[0, 0, 0]}>
    <Scene />
  </World>
</Canvas>

<footer class='absolute bottom-5 right-5 flex gap-2'>
  <a title='Github' target='_tab' href='https://github.com/michealparks'>
    <img class="w-8 h-8" alt='Github' src='/img/github.png' />
  </a>
  <a title='Spotify' target='_tab' href='https://open.spotify.com/user/micheal_parks'>
    <img class="w-8 h-8" alt='Spotify' src='/img/spotify.png' />
  </a>
  <a title='Twitter' target='_tab' href='https://twitter.com/godisacomputer'>
    <img class="w-8 h-8" alt='Twitter' src='/img/twitter.png' />
  </a>
</footer>
