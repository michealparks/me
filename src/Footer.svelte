<style>
  footer {
    display: grid;
    grid-template-columns: 1fr 10fr;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    max-width: var(--content-width);
    margin: auto;
    padding: 30px;
  }

  img {
    max-width: 180px;
    border-radius: 100%;
    box-shadow: var(--lighting-shadow);
  }

  h2 {
    font-family: 'Roboto Mono', monospace;
    font-size: 30px;
    
  }

  h2 span {
    display: inline-block;
    animation: jump;
    animation-duration: 200ms;
    animation-iteration-count: infinite;
  }

  a svg {
    width: 100%;
    height: 100%;
  }

  p.social-media {
    display: flex;
    align-items: center;
    margin: 0
  }

  p.social-media span {
    margin: 0 7px 0 0;
  }

   p.social-media a {
    display: inline-block;
    width: 40px;
    height: 40px;
    padding: 0 7px;
  }

  @keyframes jump {
    0%  { transform: translate(0, 0) }
    50% { transform: translate(0, -5px) }
    100% { transform: translate(0, 0) }
  }

</style>

<footer>
  <img alt="Micheal's detatched head." src="profile.jpg" />
  <section>
    <h2>
      {#each 'about this human:' as char, i (char)}
        <span style="animation-delay: {i * 52}ms; {char === ' ' ? 'margin-left: 10px;' : ''}">{char}</span>
      {/each}
    </h2>
    <p>
      <strong>Micheal Parks</strong> is a software engineer or whatever who lives in a <a target="_tab" href="https://duckduckgo.com/?q=new+york+city&ia=news&iaxm=about">Large Apple</a>.
    </p>

    <p class="social-media">
      <span>He has links for you but of course</span>
      <a target="_tab" href="https://open.spotify.com/user/micheal_parks">
        <svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
      </a>
      <a target="_tab" href="https://github.com/michealparks">
        <svg class="icon icon-github"><use xlink:href="#icon-github"></use></svg>
      </a>
      <a target="_tab" href="https://soundcloud.com/dead_culture">
        <svg class="icon icon-soundcloud"><use xlink:href="#icon-soundcloud"></use></svg>
      </a>

      <span style="margin-left: 7px;">and the best link!!!!1!!1</span>
      <a target="_tab" href="https://www.linkedin.com/in/michealparks/">
        <svg class="icon icon-linkedin"><use xlink:href="#icon-linkedin"></use></svg>
      </a>
    </p>
  </section>
</footer>