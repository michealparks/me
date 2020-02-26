
<script>
import { onMount } from 'svelte'

let didClick = false
let target

const handleJamz = () => {
  target.playVideo()
  document.querySelector('main').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  didClick = true
}

onMount(() => {
  let tag = document.createElement('script')
  tag.async = true
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)

  let player
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('jamz', {
      events: { onReady: (e) => {
        console.log('ready', e)
        target = e.target
      } }
    })
  }
})
</script>

<style>
button {
  position: absolute;
  bottom: 5px;
  right: 5px;
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

{#if didClick === false}
  <button on:click={handleJamz} id="jamz-button">pump up my jamz</button>
{/if}

<iframe
  id="jamz"
  title="Jamz"
  width="560"
  height="315"
  src="https://www.youtube.com/embed/4T1t5OFOYDU?enablejsapi=1"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
/>