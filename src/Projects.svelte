
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
}
article {
  border-radius: 50px;
  background: var(--lighting-shadow-bg);
  padding: 40px;
  box-shadow: var(--lighting-shadow);
}
</style>

<script>
const projects = [
  {
    title: 'Galeri',
    summary: 'Galeri is a chrome extension or a desktop app focused on artwork discovery.'
  }, {
    title: 'Koschei Society Webchat Service',
    summary: ''
  }, {
    title: 'Sim Shitty',
    summary: ''
  }
]
</script>

<section>
  <h2>Current projects</h2>
  <current-projects>
    {#each projects as project, i (i)}
      <article>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </article>
    {/each}
  </current-projects>
</section>
