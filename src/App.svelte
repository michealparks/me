
<style>
  :global(body) {
    margin: 0;
    font-family: 'Nunito', sans-serif;
  }

  :global(h1) {
    font-size: 5.9vw;
    font-size: min(50px, 5.9vw);
  }
  :global(h2) {
    font-size: 3.0vh;
  }
  :global(p) {
    font-size: 2vmin;
  }

  :global(body) * {
    box-sizing: border-box;
    }
</style>

<script>
  import Header from './Header.svelte'
  import Projects from './Projects.svelte'
  import Footer from './Footer.svelte'
</script>

<main>
  <Header />
  <Projects />
  <Footer />
</main>
