'use strict';

function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}

const colorMap = {
  red: '#ef9a9a',
  pink: '#F48FB1',
  purple: '#CE93D8',
  deeppurple: '#B39DDB',
  indigo: '#9FA8DA',
  blue: '#90CAF9',
  lightblue: '#81D4FA',
  cyan: '#80DEEA',
  teal: '#80CBC4',
  green: '#A5D6A7',
  yellow: '#FFF59D',
  amber: '#FFE082',
  orange: '#FFCC80',
  deeporange: '#FFAB91'
};

/* src\Header.svelte generated by Svelte v3.18.1 */

const css = {
	code: "header.svelte-1ccibik{display:grid;grid-template-columns:1fr 3fr 1fr;padding:30px}section.svelte-1ccibik{position:relative;display:flex;justify-content:center;align-items:center;width:100%;max-width:800px;grid-area:1 / 2 / 2 / 3;margin:auto;perspective:300px}h1.svelte-1ccibik{position:relative;font-size:50px;text-align:center;font-family:'Comfortaa', sans-serif;font-family:'Roboto Mono', monospace}bg-circle.svelte-1ccibik{position:absolute;top:0;left:0;border-radius:100%;opacity:0.5}",
	map: "{\"version\":3,\"file\":\"Header.svelte\",\"sources\":[\"Header.svelte\"],\"sourcesContent\":[\"<style>\\r\\n  header {\\r\\n    display: grid;\\r\\n    grid-template-columns: 1fr 3fr 1fr;\\r\\n    padding: 30px;\\r\\n  }\\r\\n\\r\\n  section {\\r\\n    position: relative;\\r\\n    display: flex;\\r\\n    justify-content: center;\\r\\n    align-items: center;\\r\\n    width: 100%;\\r\\n    max-width: 800px;\\r\\n    grid-area: 1 / 2 / 2 / 3;\\r\\n    margin: auto;\\r\\n    perspective: 300px;\\r\\n  }\\r\\n\\r\\n  h1 {\\r\\n    position: relative;\\r\\n    font-size: 50px;\\r\\n    text-align: center;\\r\\n    font-family: 'Comfortaa', sans-serif;\\r\\n    font-family: 'Roboto Mono', monospace;\\r\\n  }\\r\\n\\r\\n  bg-circle {\\r\\n    position: absolute;\\r\\n    top: 0;\\r\\n    left: 0;\\r\\n    border-radius: 100%;\\r\\n    opacity: 0.5;\\r\\n  }\\r\\n</style>\\r\\n\\r\\n<script>\\r\\nimport { onMount } from 'svelte'\\r\\nimport { colorMap } from './consts.js'\\r\\n\\r\\nconst duration = 20000\\r\\nconst size = 150\\r\\nconst width = 800 - size\\r\\nconst height = 200 - size\\r\\nconst depth = 100\\r\\n\\r\\nlet opacity = 0\\r\\n\\r\\nlet colors = [] \\r\\nfor (const hex of Object.values(colorMap)) {\\r\\n  colors.push({ hex, x: 0, y: 0, z: 0 })\\r\\n}\\r\\n\\r\\nconst setRands = (w = window.innerWidth - size) => {\\r\\n  for (const color of colors) {\\r\\n    color.x = Math.random() * Math.min(width, w)\\r\\n    color.y = Math.random() * height\\r\\n    color.z = Math.random() * depth\\r\\n  }\\r\\n  colors = colors\\r\\n}\\r\\n\\r\\nsetRands(width)\\r\\n\\r\\nonMount(() => {\\r\\n  setTimeout(() => {\\r\\n    opacity = 0.5\\r\\n    setRands()\\r\\n    setInterval(setRands, duration)\\r\\n  }, 10)\\r\\n})\\r\\n\\r\\n</script>\\r\\n\\r\\n<header>\\r\\n  <section style=\\\"height: {height + size}px\\\">\\r\\n    {#each colors as color (color.hex)}\\r\\n      <bg-circle\\r\\n        style=\\\"\\r\\n          width: {size}px;\\r\\n          height: {size}px;\\r\\n          background-color: {color.hex};\\r\\n          transform: translate3d({color.x}px, {color.y}px, {color.z}px);\\r\\n          opacity: {opacity};\\r\\n          transition: transform {duration}ms, opacity 1500ms;\\r\\n        \\\"\\r\\n      ></bg-circle>\\r\\n    {/each}\\r\\n\\r\\n    <h1 class=\\\"font-effect-anaglyph\\\">Hello web.</h1>\\r\\n  </section>\\r\\n</header>\\r\\n\"],\"names\":[],\"mappings\":\"AACE,MAAM,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAClC,OAAO,CAAE,IAAI,AACf,CAAC,AAED,OAAO,eAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACxB,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,KAAK,AACpB,CAAC,AAED,EAAE,eAAC,CAAC,AACF,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,WAAW,CAAC,CAAC,UAAU,CACpC,WAAW,CAAE,aAAa,CAAC,CAAC,SAAS,AACvC,CAAC,AAED,SAAS,eAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,aAAa,CAAE,IAAI,CACnB,OAAO,CAAE,GAAG,AACd,CAAC\"}"
};

const duration = 20000;
const size = 150;
const depth = 100;

const Header = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const width = 800 - size;
	const height = 200 - size;
	let opacity = 0;
	let colors = [];

	for (const hex of Object.values(colorMap)) {
		colors.push({ hex, x: 0, y: 0, z: 0 });
	}

	const setRands = (w = window.innerWidth - size) => {
		for (const color of colors) {
			color.x = Math.random() * Math.min(width, w);
			color.y = Math.random() * height;
			color.z = Math.random() * depth;
		}

		colors = colors;
	};

	setRands(width);

	onMount(() => {
		setTimeout(
			() => {
				opacity = 0.5;
				setRands();
				setInterval(setRands, duration);
			},
			10
		);
	});

	$$result.css.add(css);

	return `<header class="${"svelte-1ccibik"}">
  <section style="${"height: " + escape(height + size) + "px"}" class="${"svelte-1ccibik"}">
    ${each(colors, color => `<bg-circle style="${"\r\n          width: " + escape(size) + "px;\r\n          height: " + escape(size) + "px;\r\n          background-color: " + escape(color.hex) + ";\r\n          transform: translate3d(" + escape(color.x) + "px, " + escape(color.y) + "px, " + escape(color.z) + "px);\r\n          opacity: " + escape(opacity) + ";\r\n          transition: transform " + escape(duration) + "ms, opacity 1500ms;\r\n        "}" class="${"svelte-1ccibik"}"></bg-circle>`)}

    <h1 class="${"font-effect-anaglyph svelte-1ccibik"}">Hello web.</h1>
  </section>
</header>`;
});

/* src\Projects.svelte generated by Svelte v3.18.1 */

const Projects = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<main>
  <h2>Current projects</h2>
  <article>
    <h3>Galeri</h3>
  </article>
</main>`;
});

/* src\Footer.svelte generated by Svelte v3.18.1 */

const css$1 = {
	code: "footer.svelte-2gv8bw{display:grid;grid-template-columns:1fr 10fr;grid-template-rows:1fr;grid-column-gap:20px;padding:30px;background-color:#eee}img.svelte-2gv8bw{max-width:180px;border-radius:100%}h2.svelte-2gv8bw{font-family:'Roboto Mono', monospace}",
	map: "{\"version\":3,\"file\":\"Footer.svelte\",\"sources\":[\"Footer.svelte\"],\"sourcesContent\":[\"<style>\\r\\n  footer {\\r\\n    display: grid;\\r\\n    grid-template-columns: 1fr 10fr;\\r\\n    grid-template-rows: 1fr;\\r\\n    grid-column-gap: 20px;\\r\\n    padding: 30px;\\r\\n    background-color: #eee;\\r\\n  }\\r\\n\\r\\n  img {\\r\\n    max-width: 180px;\\r\\n    border-radius: 100%;\\r\\n  }\\r\\n\\r\\n  h2 {\\r\\n    font-family: 'Roboto Mono', monospace;\\r\\n  }\\r\\n\\r\\n</style>\\r\\n\\r\\n<footer>\\r\\n  <img alt=\\\"Micheal's detatched head.\\\" src=\\\"profile.jpg\\\" />\\r\\n\\r\\n  <section>\\r\\n    <h2 class=\\\"font-effect-anaglyph\\\">Micheal Parks</h2>\\r\\n    <p></p>\\r\\n  </section>\\r\\n  \\r\\n\\r\\n  <social-media>\\r\\n\\r\\n  </social-media>\\r\\n</footer>\"],\"names\":[],\"mappings\":\"AACE,MAAM,cAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,GAAG,CAAC,IAAI,CAC/B,kBAAkB,CAAE,GAAG,CACvB,eAAe,CAAE,IAAI,CACrB,OAAO,CAAE,IAAI,CACb,gBAAgB,CAAE,IAAI,AACxB,CAAC,AAED,GAAG,cAAC,CAAC,AACH,SAAS,CAAE,KAAK,CAChB,aAAa,CAAE,IAAI,AACrB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,WAAW,CAAE,aAAa,CAAC,CAAC,SAAS,AACvC,CAAC\"}"
};

const Footer = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$1);

	return `<footer class="${"svelte-2gv8bw"}">
  <img alt="${"Micheal's detatched head."}" src="${"profile.jpg"}" class="${"svelte-2gv8bw"}">

  <section>
    <h2 class="${"font-effect-anaglyph svelte-2gv8bw"}">Micheal Parks</h2>
    <p></p>
  </section>
  

  <social-media>

  </social-media>
</footer>`;
});

/* src\App.svelte generated by Svelte v3.18.1 */

const css$2 = {
	code: "body{margin:0;font-family:'Nunito', sans-serif}body .svelte-u3gbwx{box-sizing:border-box}",
	map: "{\"version\":3,\"file\":\"App.svelte\",\"sources\":[\"App.svelte\"],\"sourcesContent\":[\"\\r\\n<style>\\r\\n  :global(body) {\\r\\n    margin: 0;\\r\\n    font-family: 'Nunito', sans-serif;\\r\\n  }\\r\\n\\r\\n  :global(body) * {\\r\\n    box-sizing: border-box;\\r\\n    }\\r\\n</style>\\r\\n\\r\\n<script>\\r\\n  import Header from './Header.svelte'\\r\\n  import Projects from './Projects.svelte'\\r\\n  import Footer from './Footer.svelte'\\r\\n</script>\\r\\n\\r\\n<main>\\r\\n  <Header />\\r\\n  <Projects />\\r\\n  <Footer />\\r\\n</main>\\r\\n\"],\"names\":[],\"mappings\":\"AAEU,IAAI,AAAE,CAAC,AACb,MAAM,CAAE,CAAC,CACT,WAAW,CAAE,QAAQ,CAAC,CAAC,UAAU,AACnC,CAAC,AAEO,IAAI,AAAC,CAAC,cAAE,CAAC,AACf,UAAU,CAAE,UAAU,AACtB,CAAC\"}"
};

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$2);

	return `<main class="${"svelte-u3gbwx"}">
  ${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
  ${validate_component(Projects, "Projects").$$render($$result, {}, {}, {})}
  ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
</main>`;
});

module.exports = App;
