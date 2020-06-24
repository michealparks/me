
<style>
section {
  padding: 100px 20px;
}
current-projects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 60px;
  max-width: var(--content-width);
  margin: auto;
}
h2 {
  font-family: 'Roboto Mono', monospace;
  text-align: center;
  text-shadow: var(--lighting-text-shadow);
  font-size: 30px;
  margin-bottom: 60px;
}
</style>

<script>
import Project from './Project.svelte'

const projects = [
  {
    title: 'Galeri',
    summary: 'Galeri is a chrome extension and desktop app focused on artwork discovery.',
    href: 'https://galeri.io',
    newTab: true
  },
  // {
  //   title: 'Koschei Society Webchat Service',
  //   summary: ''
  // },
  // {
  //   title: 'Sim Shitty',
  //   summary: ''
  // }
]
</script>

<section>
  <h2>cabinet of curiosities</h2>
  <current-projects>
    {#each projects as project, i (i)}
      <Project {...project} />
    {/each}
  </current-projects>
</section>
