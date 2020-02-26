<script>
  export let newTab = false
  export let href = ''
  export let title = ''
  export let summary = ''
</script>

<style>
a {
  border-radius: 50px;
  background: var(--lighting-shadow-bg);
  padding: 40px;
  box-shadow: var(--lighting-shadow);
  text-decoration: none;
}
</style>

<a target="{newTab ? '_tab' : '_self'}" href="{href}">
  <article>
    <h3>{title}</h3>
    <p>{summary}</p>
  </article>
</a>
