<script>
  import { colorMap } from './consts.js'

  const colors = Object.values(colorMap)

  export let newTab = false
  export let href = ''
  export let title = ''
  export let summary = ''
</script>

<style>
article {
  position: relative;
}

a {
  border-radius: 50px;
  background: var(--lighting-shadow-bg);
  padding: 40px;
  box-shadow: var(--lighting-shadow);
  text-decoration: none;
}

icon-container {
  position: absolute;
  bottom: -30px;
  opacity: 0;
  transition: 0.25s;
}

svg {
  fill: #fff;
  width: 25px;
  height: 25px;
  animation-name: fade;
  animation-iteration-count: infinite;
  animation-duration: 0.5s;
  animation-timing-function: steps(2, end)
}

a:hover icon-container {
  opacity: 1;
}

@keyframes fade {
  0%   { opacity: 0; }
  50%  { opacity: 0.5; }
  100% { opacity: 0; }
}

h3 {
  margin-top: 0;
}

svg:not(:first-child) {
  margin-left: -2px;
}
</style>

<a target="{newTab ? '_tab' : '_self'}" href="{href}">
  <article>
    <h3>{title}</h3>
    <p>{summary}</p>

    <icon-container>
      {#each Array(10) as _, i (i)}
        <svg  
          class="icon icon-arrow_forward"
          style="fill: {colors[i]}; animation-delay: {i * 42}ms;"
        >
          <use xlink:href="#icon-arrow_forward" />
        </svg>
      {/each}
    </icon-container>
    
    
  </article>
</a>
