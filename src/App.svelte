<script>
  import Head from './Head.svelte'
  import Stylesheet from './Stylesheet.svelte'
  import Header from './Header.svelte'
  import Projects from './Projects.svelte'
  import Footer from './Footer.svelte'
  import Jamz from './Jamz.svelte'
  import Icons from './Icons.svelte'
</script>

<style>
main {
  width: 100%;
  min-height: 100vh;
  background-color: #222;
  color: #eee
}
</style>

<Head />
<Stylesheet />

<main>
  <Header />
  <Projects />
  <Footer />
  <Jamz />
  <Icons />
</main>
