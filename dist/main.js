function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            while (j < node.attributes.length) {
                const attribute = node.attributes[j];
                if (attributes[attribute.name]) {
                    j++;
                }
                else {
                    node.removeAttribute(attribute.name);
                }
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
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

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
const seen_callbacks = new Set();
function flush() {
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
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

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (77:4) {#each colors as color (color.hex)}
function create_each_block(key_1, ctx) {
	let bg_circle;

	return {
		key: key_1,
		first: null,
		c() {
			bg_circle = element("bg-circle");
			this.h();
		},
		l(nodes) {
			bg_circle = claim_element(nodes, "BG-CIRCLE", { style: true, class: true });
			children(bg_circle).forEach(detach);
			this.h();
		},
		h() {
			set_style(bg_circle, "width", size + "px");
			set_style(bg_circle, "height", size + "px");
			set_style(bg_circle, "background-color", /*color*/ ctx[5].hex);
			set_style(bg_circle, "transform", "translate3d(" + /*color*/ ctx[5].x + "px, " + /*color*/ ctx[5].y + "px, " + /*color*/ ctx[5].z + "px)");
			set_style(bg_circle, "opacity", /*opacity*/ ctx[0]);
			set_style(bg_circle, "transition", "transform " + duration + "ms, opacity 1500ms");
			set_custom_element_data(bg_circle, "class", "svelte-1ccibik");
			this.first = bg_circle;
		},
		m(target, anchor) {
			insert(target, bg_circle, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*colors*/ 2) {
				set_style(bg_circle, "background-color", /*color*/ ctx[5].hex);
			}

			if (dirty & /*colors*/ 2) {
				set_style(bg_circle, "transform", "translate3d(" + /*color*/ ctx[5].x + "px, " + /*color*/ ctx[5].y + "px, " + /*color*/ ctx[5].z + "px)");
			}

			if (dirty & /*opacity*/ 1) {
				set_style(bg_circle, "opacity", /*opacity*/ ctx[0]);
			}
		},
		d(detaching) {
			if (detaching) detach(bg_circle);
		}
	};
}

function create_fragment(ctx) {
	let header;
	let section;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t0;
	let h1;
	let t1;
	let each_value = /*colors*/ ctx[1];
	const get_key = ctx => /*color*/ ctx[5].hex;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			header = element("header");
			section = element("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			h1 = element("h1");
			t1 = text("Hello web.");
			this.h();
		},
		l(nodes) {
			header = claim_element(nodes, "HEADER", { class: true });
			var header_nodes = children(header);
			section = claim_element(header_nodes, "SECTION", { style: true, class: true });
			var section_nodes = children(section);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(section_nodes);
			}

			t0 = claim_space(section_nodes);
			h1 = claim_element(section_nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Hello web.");
			h1_nodes.forEach(detach);
			section_nodes.forEach(detach);
			header_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(h1, "class", "font-effect-anaglyph svelte-1ccibik");
			set_style(section, "height", /*height*/ ctx[2] + size + "px");
			attr(section, "class", "svelte-1ccibik");
			attr(header, "class", "svelte-1ccibik");
		},
		m(target, anchor) {
			insert(target, header, anchor);
			append(header, section);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(section, null);
			}

			append(section, t0);
			append(section, h1);
			append(h1, t1);
		},
		p(ctx, [dirty]) {
			const each_value = /*colors*/ ctx[1];
			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, destroy_block, create_each_block, t0, get_each_context);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(header);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

const duration = 20000;
const size = 150;
const depth = 100;

function instance($$self, $$props, $$invalidate) {
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

		$$invalidate(1, colors);
	};

	setRands(width);

	onMount(() => {
		setTimeout(
			() => {
				$$invalidate(0, opacity = 0.5);
				setRands();
				setInterval(setRands, duration);
			},
			10
		);
	});

	return [opacity, colors, height];
}

class Header extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

/* src\Projects.svelte generated by Svelte v3.18.1 */

function create_fragment$1(ctx) {
	let main;
	let h2;
	let t0;
	let t1;
	let article;
	let h3;
	let t2;

	return {
		c() {
			main = element("main");
			h2 = element("h2");
			t0 = text("Current projects");
			t1 = space();
			article = element("article");
			h3 = element("h3");
			t2 = text("Galeri");
		},
		l(nodes) {
			main = claim_element(nodes, "MAIN", {});
			var main_nodes = children(main);
			h2 = claim_element(main_nodes, "H2", {});
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Current projects");
			h2_nodes.forEach(detach);
			t1 = claim_space(main_nodes);
			article = claim_element(main_nodes, "ARTICLE", {});
			var article_nodes = children(article);
			h3 = claim_element(article_nodes, "H3", {});
			var h3_nodes = children(h3);
			t2 = claim_text(h3_nodes, "Galeri");
			h3_nodes.forEach(detach);
			article_nodes.forEach(detach);
			main_nodes.forEach(detach);
		},
		m(target, anchor) {
			insert(target, main, anchor);
			append(main, h2);
			append(h2, t0);
			append(main, t1);
			append(main, article);
			append(article, h3);
			append(h3, t2);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(main);
		}
	};
}

class Projects extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$1, safe_not_equal, {});
	}
}

/* src\Footer.svelte generated by Svelte v3.18.1 */

function create_fragment$2(ctx) {
	let footer;
	let img;
	let img_src_value;
	let t0;
	let section;
	let h2;
	let t1;
	let t2;
	let p;
	let t3;
	let social_media;

	return {
		c() {
			footer = element("footer");
			img = element("img");
			t0 = space();
			section = element("section");
			h2 = element("h2");
			t1 = text("Micheal Parks");
			t2 = space();
			p = element("p");
			t3 = space();
			social_media = element("social-media");
			this.h();
		},
		l(nodes) {
			footer = claim_element(nodes, "FOOTER", { class: true });
			var footer_nodes = children(footer);
			img = claim_element(footer_nodes, "IMG", { alt: true, src: true, class: true });
			t0 = claim_space(footer_nodes);
			section = claim_element(footer_nodes, "SECTION", {});
			var section_nodes = children(section);
			h2 = claim_element(section_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t1 = claim_text(h2_nodes, "Micheal Parks");
			h2_nodes.forEach(detach);
			t2 = claim_space(section_nodes);
			p = claim_element(section_nodes, "P", {});
			children(p).forEach(detach);
			section_nodes.forEach(detach);
			t3 = claim_space(footer_nodes);
			social_media = claim_element(footer_nodes, "SOCIAL-MEDIA", {});
			var social_media_nodes = children(social_media);
			social_media_nodes.forEach(detach);
			footer_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(img, "alt", "Micheal's detatched head.");
			if (img.src !== (img_src_value = "profile.jpg")) attr(img, "src", img_src_value);
			attr(img, "class", "svelte-2gv8bw");
			attr(h2, "class", "font-effect-anaglyph svelte-2gv8bw");
			attr(footer, "class", "svelte-2gv8bw");
		},
		m(target, anchor) {
			insert(target, footer, anchor);
			append(footer, img);
			append(footer, t0);
			append(footer, section);
			append(section, h2);
			append(h2, t1);
			append(section, t2);
			append(section, p);
			append(footer, t3);
			append(footer, social_media);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(footer);
		}
	};
}

class Footer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$2, safe_not_equal, {});
	}
}

/* src\App.svelte generated by Svelte v3.18.1 */

function create_fragment$3(ctx) {
	let main;
	let t0;
	let t1;
	let current;
	const header = new Header({});
	const projects = new Projects({});
	const footer = new Footer({});

	return {
		c() {
			main = element("main");
			create_component(header.$$.fragment);
			t0 = space();
			create_component(projects.$$.fragment);
			t1 = space();
			create_component(footer.$$.fragment);
			this.h();
		},
		l(nodes) {
			main = claim_element(nodes, "MAIN", { class: true });
			var main_nodes = children(main);
			claim_component(header.$$.fragment, main_nodes);
			t0 = claim_space(main_nodes);
			claim_component(projects.$$.fragment, main_nodes);
			t1 = claim_space(main_nodes);
			claim_component(footer.$$.fragment, main_nodes);
			main_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(main, "class", "svelte-u3gbwx");
		},
		m(target, anchor) {
			insert(target, main, anchor);
			mount_component(header, main, null);
			append(main, t0);
			mount_component(projects, main, null);
			append(main, t1);
			mount_component(footer, main, null);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(header.$$.fragment, local);
			transition_in(projects.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(header.$$.fragment, local);
			transition_out(projects.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(main);
			destroy_component(header);
			destroy_component(projects);
			destroy_component(footer);
		}
	};
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$3, safe_not_equal, {});
	}
}

export default App;
