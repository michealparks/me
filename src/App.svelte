
<style>
  :global(body) {
    margin: 0;
    font-family: 'Nunito', sans-serif;
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
