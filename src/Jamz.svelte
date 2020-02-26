
<script>
import { onMount } from 'svelte'

let state = 'unjammed'
let target

const handleJamz = () => {
  target.playVideo()
  document.querySelector('main').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  state = 'jamming'
}

const handleJamming = () => {
  target.stopVideo()
  document.querySelector('main').style.backgroundColor = ''
  state = 'jammed'
}

onMount(() => {
  const tag = document.createElement('script')
  tag.async = true
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)

  window.onYouTubeIframeAPIReady = () => new YT.Player('jamz', {
    events: { onReady: (e) => {
      console.log('ready', e)
      target = e.target
    } }
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
    <button on:click={handleJamz}>pump up my jamz</button>
  {:else if state === 'jamming'}
    <button on:click={handleJamming}>stop!! jammed 'nuff!</button>
  {:else}
    <button on:click={handleJamz}>more! moar JAMZ!</button>
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