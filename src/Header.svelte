<style>
  header {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    padding: 30px;
  }

  section {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 800px;
    grid-area: 1 / 2 / 2 / 3;
    margin: auto;
    perspective: 300px;
  }

  h1 {
    position: relative;
    text-align: center;
    font-family: 'Comfortaa', sans-serif;
    font-family: 'Roboto Mono', monospace;
    color: #000;
    letter-spacing: -15px;
    transition-timing-function: steps(32, end);
  }

  h1.expanded {
    letter-spacing: -5px;
  }

  bg-circle {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100%;
    opacity: 0.5;
  }
</style>

<script>
import { onMount } from 'svelte'
import { colorMap } from './consts.js'

const duration = 40000
const h1duration = 10000
const size = 150
const width = 800 - size
const height = 200 - size
const depth = 100

let opacity = 0

let h1State = ''

let colors = [] 
for (const hex of Object.values(colorMap)) {
  colors.push({ hex, x: 0, y: 0, z: 0 })
}

const setRands = (w = window.innerWidth - size) => {
  for (const color of colors) {
    color.x = Math.random() * Math.min(width, w)
    color.y = Math.random() * height
    color.z = Math.random() * depth
  }
  colors = colors
}

const seth1State = () => {
  h1State = (h1State === '') ? 'expanded' : ''
}

setRands(width)

onMount(() => {
  setTimeout(() => {
    opacity = 0.5
    setRands()
    seth1State()

    setInterval(seth1State, h1duration)
    setInterval(setRands, duration)
  }, 10)
})

</script>

<header>
  <section style="height: {height + size}px">
    {#each colors as color (color.hex)}
      <bg-circle
        style="
          width: {size}px;
          height: {size}px;
          background-color: {color.hex};
          box-shadow:  20px 20px 40px {color.hex}, 
             -20px -20px 60px {color.hex};
          transform: translate3d({color.x}px, {color.y}px, {color.z}px);
          opacity: {opacity};
          transition: transform {duration}ms, opacity 1500ms;
        "
      ></bg-circle>
    {/each}

    <h1 style="transition-duration: {h1duration}ms;" class="font-effect-anaglyph {h1State}">hi i am micheal</h1>

    
  </section>
</header>
