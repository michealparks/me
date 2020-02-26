<script>
  import Stylesheet from './Stylesheet.svelte'
  import Header from './Header.svelte'
  import Projects from './Projects.svelte'
  import Footer from './Footer.svelte'
  import Jamz from './Jamz.svelte'
  import Icons from './Icons.svelte'
</script>

<style>
:global(:root) {
  --content-width: 1100px;
  --lighting-shadow-bg: linear-gradient(145deg, #1f1f1f, #242424);
  --lighting-shadow: 20px 20px 60px #1d1d1d,  -20px -20px 60px #272727;;
  --lighting-text-shadow: 10px 10px 10px #0e0e0e, -10px -10px 10px #363636;
}

:global(body) {
  background-color: #222;
}

:global(a) {
  color: #ccc;
}

main {
  width: 100%;
  min-height: 100vh;
  background-color: #222;
  color: #eee
}
</style>

<main>
  <Stylesheet />
  <Header />
  <Projects />
  <Footer />
  <Jamz />
  <Icons />
</main>
