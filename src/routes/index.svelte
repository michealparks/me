<style>
p {
	text-align: center;
	margin: 0 auto;
}

p {
	margin: 1em auto;
}

a {
  text-decoration: none;
}

section {
  padding: 100px 20px;
}

h2 {
  text-align: center;
  text-shadow: var(--lighting-text-shadow);
  font-size: 30px;
  margin-bottom: 60px;
}
</style>

<svelte:head>
	<title>Micheal Parks</title>
</svelte:head>

<script>
const doing = [
  {
    title: 'Super Adventure Puzzle',
    href: '/super-adventure-puzzle',
    summary: ''
  }
]

const done = [
  {
    title: 'Galeri',
    summary: 'Galeri is a chrome extension and desktop app focused on artwork discovery.',
    href: 'https://galeri.io',
    newTab: true
  }, {
    title: 'Koschei Society Webchat Service',
    href: 'https://github.com/michealparks/game-dialogue',
    summary: ''
  }
]
</script>

<section>
  <h2>doing</h2>
  {#each doing as { title, summary, newTab, href }, i (i)}
    <a target="{newTab ? '_tab' : '_self'}" href="{href}">
      <article>
        <h3>{title}</h3>
        <p>{summary}</p>
      </article>
    </a>
  {/each}
</section>

<section>
  <h2>done</h2>
  {#each done as { title, summary, newTab, href }, i (i)}
    <a target="{newTab ? '_tab' : '_self'}" href="{href}">
      <article>
        <h3>{title}</h3>
        <p>{summary}</p>
      </article>
    </a>
  {/each}
</section>
