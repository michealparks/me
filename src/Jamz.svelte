
<script>
import { onMount } from 'svelte'

let state = 'unjammed'
let target

const startJamz = () => {
  target.playVideo()
  state = 'jamming'
}

const endJamz = () => {
  target.stopVideo()
  document.querySelector('main').style.backgroundColor = ''
  state = 'jammed'
}

const onPlayerReady = (e) => {
  target = e.target
}

const onPlayerStateChange = (e) => {
  switch (e.data) {
    case YT.PlayerState.ENDED:
      endJamz()
      return
    case YT.PlayerState.PLAYING:
      document.querySelector('main').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      return
  }
}

onMount(() => {
  const tag = document.createElement('script')
  tag.async = true
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)

  window.onYouTubeIframeAPIReady = () => new YT.Player('jamz', {
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  })
})
</script>

<style>
button-container {
  display: flex;
  justify-content: flex-end;
}

button {
  margin: 10px;
  color: #fff;
  background-color: transparent;
  font-family: comic sans;
}

iframe {
  --size: 400px;
  position: fixed;
  z-index: -1;
  opacity: 0.3;
  margin: calc(var(--size) / -2);
  height: calc(100% + var(--size));
  width: calc(100% + var(--size));
  top: 0;
  left: 0;
}
</style>

<button-container>
  {#if state === 'unjammed'}
    <button on:click={startJamz}>pump up my jamz</button>
  {:else if state === 'jamming'}
    <button on:click={endJamz}>stop!! 'nuff jam TIME!!</button>
  {:else}
    <button on:click={startJamz}>more! moar JAMZ!</button>
  {/if}
</button-container>

<iframe
  id="jamz"
  title="Jamz"
  width="560"
  height="315"
  src="https://www.youtube.com/embed/4T1t5OFOYDU?enablejsapi=1"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
/>