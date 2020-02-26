function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
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
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
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
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
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
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
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
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
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
    flushing = false;
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
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
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
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
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

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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

/* src\Stylesheet.svelte generated by Svelte v3.19.1 */

class Stylesheet extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, null, safe_not_equal, {});
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

const hexToRGBA = (hex, a = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`
};

/* src\Header.svelte generated by Svelte v3.19.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (95:4) {#each colors as color (color.hex)}
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
			set_style(bg_circle, "background-color", /*color*/ ctx[7].hex);
			set_style(bg_circle, "box-shadow", "20px 20px 40px " + hexToRGBA(/*color*/ ctx[7].hex, 0.7) + ", -20px -20px 60px " + hexToRGBA(/*color*/ ctx[7].hex, 0.2));
			set_style(bg_circle, "transform", "translate3d(" + /*color*/ ctx[7].x + "px, " + /*color*/ ctx[7].y + "px, " + /*color*/ ctx[7].z + "px)");
			set_style(bg_circle, "opacity", /*opacity*/ ctx[0]);
			set_style(bg_circle, "transition", "transform " + duration + "ms, opacity 1500ms");
			set_custom_element_data(bg_circle, "class", "svelte-bvjtz1");
			this.first = bg_circle;
		},
		m(target, anchor) {
			insert(target, bg_circle, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*colors*/ 4) {
				set_style(bg_circle, "background-color", /*color*/ ctx[7].hex);
			}

			if (dirty & /*colors*/ 4) {
				set_style(bg_circle, "box-shadow", "20px 20px 40px " + hexToRGBA(/*color*/ ctx[7].hex, 0.7) + ", -20px -20px 60px " + hexToRGBA(/*color*/ ctx[7].hex, 0.2));
			}

			if (dirty & /*colors*/ 4) {
				set_style(bg_circle, "transform", "translate3d(" + /*color*/ ctx[7].x + "px, " + /*color*/ ctx[7].y + "px, " + /*color*/ ctx[7].z + "px)");
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
	let h1_class_value;
	let each_value = /*colors*/ ctx[2];
	const get_key = ctx => /*color*/ ctx[7].hex;

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
			t1 = text("hi i am micheal 👋");
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
			h1 = claim_element(section_nodes, "H1", { style: true, class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "hi i am micheal 👋");
			h1_nodes.forEach(detach);
			section_nodes.forEach(detach);
			header_nodes.forEach(detach);
			this.h();
		},
		h() {
			set_style(h1, "transition-duration", h1duration + "ms");
			attr(h1, "class", h1_class_value = "font-effect-anaglyph " + /*h1State*/ ctx[1] + " svelte-bvjtz1");
			set_style(section, "height", /*height*/ ctx[3] + size + "px");
			attr(section, "class", "svelte-bvjtz1");
			attr(header, "class", "svelte-bvjtz1");
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
			if (dirty & /*size, colors, hexToRGBA, opacity, duration*/ 5) {
				const each_value = /*colors*/ ctx[2];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, destroy_block, create_each_block, t0, get_each_context);
			}

			if (dirty & /*h1State*/ 2 && h1_class_value !== (h1_class_value = "font-effect-anaglyph " + /*h1State*/ ctx[1] + " svelte-bvjtz1")) {
				attr(h1, "class", h1_class_value);
			}
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

const duration = 40000;
const h1duration = 10000;
const size = 150;
const depth = 100;

function instance($$self, $$props, $$invalidate) {
	const width = 800 - size;
	const height = 200 - size;
	let opacity = 0;
	let h1State = "";
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

		$$invalidate(2, colors);
	};

	const seth1State = () => {
		$$invalidate(1, h1State = h1State === "" ? "expanded" : "");
	};

	setRands(width);

	onMount(() => {
		setTimeout(
			() => {
				$$invalidate(0, opacity = 0.5);
				setRands();
				seth1State();
				setInterval(seth1State, h1duration);
				setInterval(setRands, duration);
			},
			10
		);
	});

	return [opacity, h1State, colors, height];
}

class Header extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

/* src\Project.svelte generated by Svelte v3.19.1 */

function create_fragment$1(ctx) {
	let a;
	let article;
	let h3;
	let t0;
	let t1;
	let p;
	let t2;
	let a_target_value;

	return {
		c() {
			a = element("a");
			article = element("article");
			h3 = element("h3");
			t0 = text(/*title*/ ctx[2]);
			t1 = space();
			p = element("p");
			t2 = text(/*summary*/ ctx[3]);
			this.h();
		},
		l(nodes) {
			a = claim_element(nodes, "A", { target: true, href: true, class: true });
			var a_nodes = children(a);
			article = claim_element(a_nodes, "ARTICLE", {});
			var article_nodes = children(article);
			h3 = claim_element(article_nodes, "H3", {});
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, /*title*/ ctx[2]);
			h3_nodes.forEach(detach);
			t1 = claim_space(article_nodes);
			p = claim_element(article_nodes, "P", {});
			var p_nodes = children(p);
			t2 = claim_text(p_nodes, /*summary*/ ctx[3]);
			p_nodes.forEach(detach);
			article_nodes.forEach(detach);
			a_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(a, "target", a_target_value = /*newTab*/ ctx[0] ? "_tab" : "_self");
			attr(a, "href", /*href*/ ctx[1]);
			attr(a, "class", "svelte-163un4s");
		},
		m(target, anchor) {
			insert(target, a, anchor);
			append(a, article);
			append(article, h3);
			append(h3, t0);
			append(article, t1);
			append(article, p);
			append(p, t2);
		},
		p(ctx, [dirty]) {
			if (dirty & /*title*/ 4) set_data(t0, /*title*/ ctx[2]);
			if (dirty & /*summary*/ 8) set_data(t2, /*summary*/ ctx[3]);

			if (dirty & /*newTab*/ 1 && a_target_value !== (a_target_value = /*newTab*/ ctx[0] ? "_tab" : "_self")) {
				attr(a, "target", a_target_value);
			}

			if (dirty & /*href*/ 2) {
				attr(a, "href", /*href*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(a);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { newTab = false } = $$props;
	let { href = "" } = $$props;
	let { title = "" } = $$props;
	let { summary = "" } = $$props;

	$$self.$set = $$props => {
		if ("newTab" in $$props) $$invalidate(0, newTab = $$props.newTab);
		if ("href" in $$props) $$invalidate(1, href = $$props.href);
		if ("title" in $$props) $$invalidate(2, title = $$props.title);
		if ("summary" in $$props) $$invalidate(3, summary = $$props.summary);
	};

	return [newTab, href, title, summary];
}

class Project extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { newTab: 0, href: 1, title: 2, summary: 3 });
	}
}

/* src\Projects.svelte generated by Svelte v3.19.1 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (46:4) {#each projects as project, i (i)}
function create_each_block$1(key_1, ctx) {
	let first;
	let current;
	const project_spread_levels = [/*project*/ ctx[1]];
	let project_props = {};

	for (let i = 0; i < project_spread_levels.length; i += 1) {
		project_props = assign(project_props, project_spread_levels[i]);
	}

	const project = new Project({ props: project_props });

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			create_component(project.$$.fragment);
			this.h();
		},
		l(nodes) {
			first = empty();
			claim_component(project.$$.fragment, nodes);
			this.h();
		},
		h() {
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			mount_component(project, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const project_changes = (dirty & /*projects*/ 1)
			? get_spread_update(project_spread_levels, [get_spread_object(/*project*/ ctx[1])])
			: {};

			project.$set(project_changes);
		},
		i(local) {
			if (current) return;
			transition_in(project.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(project.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			destroy_component(project, detaching);
		}
	};
}

function create_fragment$2(ctx) {
	let section;
	let h2;
	let t0;
	let t1;
	let current_projects;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let each_value = /*projects*/ ctx[0];
	const get_key = ctx => /*i*/ ctx[3];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$1(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
	}

	return {
		c() {
			section = element("section");
			h2 = element("h2");
			t0 = text("cabinet of curiosities");
			t1 = space();
			current_projects = element("current-projects");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			section = claim_element(nodes, "SECTION", { class: true });
			var section_nodes = children(section);
			h2 = claim_element(section_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "cabinet of curiosities");
			h2_nodes.forEach(detach);
			t1 = claim_space(section_nodes);
			current_projects = claim_element(section_nodes, "CURRENT-PROJECTS", { class: true });
			var current_projects_nodes = children(current_projects);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(current_projects_nodes);
			}

			current_projects_nodes.forEach(detach);
			section_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(h2, "class", "svelte-60oau2");
			set_custom_element_data(current_projects, "class", "svelte-60oau2");
			attr(section, "class", "svelte-60oau2");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, h2);
			append(h2, t0);
			append(section, t1);
			append(section, current_projects);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(current_projects, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*projects*/ 1) {
				const each_value = /*projects*/ ctx[0];
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, current_projects, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(section);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

function instance$2($$self) {
	const projects = [
		{
			title: "Galeri",
			summary: "Galeri is a chrome extension and desktop app focused on artwork discovery.",
			href: "https://galeri.io",
			newTab: true
		}
	]; // {
	//   title: 'Koschei Society Webchat Service',
	//   summary: ''

	return [projects];
}

class Projects extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
	}
}

/* src\Footer.svelte generated by Svelte v3.19.1 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[0] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (66:6) {#each 'about this human:' as char, i (char)}
function create_each_block$2(key_1, ctx) {
	let span;
	let t;
	let span_style_value;

	return {
		key: key_1,
		first: null,
		c() {
			span = element("span");
			t = text(/*char*/ ctx[0]);
			this.h();
		},
		l(nodes) {
			span = claim_element(nodes, "SPAN", { style: true, class: true });
			var span_nodes = children(span);
			t = claim_text(span_nodes, /*char*/ ctx[0]);
			span_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(span, "style", span_style_value = "animation-delay: " + /*i*/ ctx[2] * 52 + "ms; " + (/*char*/ ctx[0] === " " ? "margin-left: 10px;" : ""));
			attr(span, "class", "svelte-1au8iln");
			this.first = span;
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

function create_fragment$3(ctx) {
	let footer;
	let img;
	let img_src_value;
	let t0;
	let section;
	let h2;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t1;
	let p0;
	let strong;
	let t2;
	let t3;
	let a0;
	let t4;
	let t5;
	let t6;
	let p1;
	let span0;
	let t7;
	let t8;
	let a1;
	let svg0;
	let use0;
	let t9;
	let a2;
	let svg1;
	let use1;
	let t10;
	let a3;
	let svg2;
	let use2;
	let t11;
	let span1;
	let t12;
	let t13;
	let a4;
	let svg3;
	let use3;
	let each_value = "about this human:";
	const get_key = ctx => /*char*/ ctx[0];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			footer = element("footer");
			img = element("img");
			t0 = space();
			section = element("section");
			h2 = element("h2");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			p0 = element("p");
			strong = element("strong");
			t2 = text("Micheal Parks");
			t3 = text(" is a software engineer or whatever who lives in a ");
			a0 = element("a");
			t4 = text("Large Apple");
			t5 = text(".");
			t6 = space();
			p1 = element("p");
			span0 = element("span");
			t7 = text("He has links for you but of course");
			t8 = space();
			a1 = element("a");
			svg0 = svg_element("svg");
			use0 = svg_element("use");
			t9 = space();
			a2 = element("a");
			svg1 = svg_element("svg");
			use1 = svg_element("use");
			t10 = space();
			a3 = element("a");
			svg2 = svg_element("svg");
			use2 = svg_element("use");
			t11 = space();
			span1 = element("span");
			t12 = text("and the best link!!!!1!!1");
			t13 = space();
			a4 = element("a");
			svg3 = svg_element("svg");
			use3 = svg_element("use");
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

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(h2_nodes);
			}

			h2_nodes.forEach(detach);
			t1 = claim_space(section_nodes);
			p0 = claim_element(section_nodes, "P", {});
			var p0_nodes = children(p0);
			strong = claim_element(p0_nodes, "STRONG", {});
			var strong_nodes = children(strong);
			t2 = claim_text(strong_nodes, "Micheal Parks");
			strong_nodes.forEach(detach);
			t3 = claim_text(p0_nodes, " is a software engineer or whatever who lives in a ");
			a0 = claim_element(p0_nodes, "A", { target: true, href: true });
			var a0_nodes = children(a0);
			t4 = claim_text(a0_nodes, "Large Apple");
			a0_nodes.forEach(detach);
			t5 = claim_text(p0_nodes, ".");
			p0_nodes.forEach(detach);
			t6 = claim_space(section_nodes);
			p1 = claim_element(section_nodes, "P", { class: true });
			var p1_nodes = children(p1);
			span0 = claim_element(p1_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t7 = claim_text(span0_nodes, "He has links for you but of course");
			span0_nodes.forEach(detach);
			t8 = claim_space(p1_nodes);
			a1 = claim_element(p1_nodes, "A", { target: true, href: true, class: true });
			var a1_nodes = children(a1);
			svg0 = claim_element(a1_nodes, "svg", { class: true }, 1);
			var svg0_nodes = children(svg0);
			use0 = claim_element(svg0_nodes, "use", { "xlink:href": true }, 1);
			children(use0).forEach(detach);
			svg0_nodes.forEach(detach);
			a1_nodes.forEach(detach);
			t9 = claim_space(p1_nodes);
			a2 = claim_element(p1_nodes, "A", { target: true, href: true, class: true });
			var a2_nodes = children(a2);
			svg1 = claim_element(a2_nodes, "svg", { class: true }, 1);
			var svg1_nodes = children(svg1);
			use1 = claim_element(svg1_nodes, "use", { "xlink:href": true }, 1);
			children(use1).forEach(detach);
			svg1_nodes.forEach(detach);
			a2_nodes.forEach(detach);
			t10 = claim_space(p1_nodes);
			a3 = claim_element(p1_nodes, "A", { target: true, href: true, class: true });
			var a3_nodes = children(a3);
			svg2 = claim_element(a3_nodes, "svg", { class: true }, 1);
			var svg2_nodes = children(svg2);
			use2 = claim_element(svg2_nodes, "use", { "xlink:href": true }, 1);
			children(use2).forEach(detach);
			svg2_nodes.forEach(detach);
			a3_nodes.forEach(detach);
			t11 = claim_space(p1_nodes);
			span1 = claim_element(p1_nodes, "SPAN", { style: true, class: true });
			var span1_nodes = children(span1);
			t12 = claim_text(span1_nodes, "and the best link!!!!1!!1");
			span1_nodes.forEach(detach);
			t13 = claim_space(p1_nodes);
			a4 = claim_element(p1_nodes, "A", { target: true, href: true, class: true });
			var a4_nodes = children(a4);
			svg3 = claim_element(a4_nodes, "svg", { class: true }, 1);
			var svg3_nodes = children(svg3);
			use3 = claim_element(svg3_nodes, "use", { "xlink:href": true }, 1);
			children(use3).forEach(detach);
			svg3_nodes.forEach(detach);
			a4_nodes.forEach(detach);
			p1_nodes.forEach(detach);
			section_nodes.forEach(detach);
			footer_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(img, "alt", "Micheal's detatched head.");
			if (img.src !== (img_src_value = "profile.jpg")) attr(img, "src", img_src_value);
			attr(img, "class", "svelte-1au8iln");
			attr(h2, "class", "svelte-1au8iln");
			attr(a0, "target", "_tab");
			attr(a0, "href", "https://duckduckgo.com/?q=new+york+city&ia=news&iaxm=about");
			attr(span0, "class", "svelte-1au8iln");
			xlink_attr(use0, "xlink:href", "#icon-spotify");
			attr(svg0, "class", "icon icon-spotify svelte-1au8iln");
			attr(a1, "target", "_tab");
			attr(a1, "href", "https://open.spotify.com/user/micheal_parks");
			attr(a1, "class", "svelte-1au8iln");
			xlink_attr(use1, "xlink:href", "#icon-github");
			attr(svg1, "class", "icon icon-github svelte-1au8iln");
			attr(a2, "target", "_tab");
			attr(a2, "href", "https://github.com/michealparks");
			attr(a2, "class", "svelte-1au8iln");
			xlink_attr(use2, "xlink:href", "#icon-soundcloud");
			attr(svg2, "class", "icon icon-soundcloud svelte-1au8iln");
			attr(a3, "target", "_tab");
			attr(a3, "href", "https://soundcloud.com/dead_culture");
			attr(a3, "class", "svelte-1au8iln");
			set_style(span1, "margin-left", "7px");
			attr(span1, "class", "svelte-1au8iln");
			xlink_attr(use3, "xlink:href", "#icon-linkedin");
			attr(svg3, "class", "icon icon-linkedin svelte-1au8iln");
			attr(a4, "target", "_tab");
			attr(a4, "href", "https://www.linkedin.com/in/michealparks/");
			attr(a4, "class", "svelte-1au8iln");
			attr(p1, "class", "social-media svelte-1au8iln");
			attr(footer, "class", "svelte-1au8iln");
		},
		m(target, anchor) {
			insert(target, footer, anchor);
			append(footer, img);
			append(footer, t0);
			append(footer, section);
			append(section, h2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(h2, null);
			}

			append(section, t1);
			append(section, p0);
			append(p0, strong);
			append(strong, t2);
			append(p0, t3);
			append(p0, a0);
			append(a0, t4);
			append(p0, t5);
			append(section, t6);
			append(section, p1);
			append(p1, span0);
			append(span0, t7);
			append(p1, t8);
			append(p1, a1);
			append(a1, svg0);
			append(svg0, use0);
			append(p1, t9);
			append(p1, a2);
			append(a2, svg1);
			append(svg1, use1);
			append(p1, t10);
			append(p1, a3);
			append(a3, svg2);
			append(svg2, use2);
			append(p1, t11);
			append(p1, span1);
			append(span1, t12);
			append(p1, t13);
			append(p1, a4);
			append(a4, svg3);
			append(svg3, use3);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(footer);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

class Footer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$3, safe_not_equal, {});
	}
}

/* src\Jamz.svelte generated by Svelte v3.19.1 */

function create_if_block(ctx) {
	let button;
	let t;
	let dispose;

	return {
		c() {
			button = element("button");
			t = text("pump up my jamz");
			this.h();
		},
		l(nodes) {
			button = claim_element(nodes, "BUTTON", { id: true, class: true });
			var button_nodes = children(button);
			t = claim_text(button_nodes, "pump up my jamz");
			button_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(button, "id", "jamz-button");
			attr(button, "class", "svelte-1i6fbd5");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);
			dispose = listen(button, "click", /*handleJamz*/ ctx[1]);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			dispose();
		}
	};
}

function create_fragment$4(ctx) {
	let t;
	let iframe;
	let iframe_src_value;
	let if_block = /*didClick*/ ctx[0] === false && create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			t = space();
			iframe = element("iframe");
			this.h();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			t = claim_space(nodes);

			iframe = claim_element(nodes, "IFRAME", {
				id: true,
				title: true,
				width: true,
				height: true,
				src: true,
				frameborder: true,
				allow: true,
				allowfullscreen: true,
				class: true
			});

			children(iframe).forEach(detach);
			this.h();
		},
		h() {
			attr(iframe, "id", "jamz");
			attr(iframe, "title", "Jamz");
			attr(iframe, "width", "560");
			attr(iframe, "height", "315");
			if (iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/4T1t5OFOYDU?enablejsapi=1")) attr(iframe, "src", iframe_src_value);
			attr(iframe, "frameborder", "0");
			attr(iframe, "allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
			iframe.allowFullscreen = true;
			attr(iframe, "class", "svelte-1i6fbd5");
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, t, anchor);
			insert(target, iframe, anchor);
		},
		p(ctx, [dirty]) {
			if (/*didClick*/ ctx[0] === false) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(t);
			if (detaching) detach(iframe);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let didClick = false;
	let target;

	const handleJamz = () => {
		target.playVideo();
		document.querySelector("main").style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		$$invalidate(0, didClick = true);
	};

	onMount(() => {
		let tag = document.createElement("script");
		tag.async = true;
		tag.src = "https://www.youtube.com/iframe_api";
		document.head.appendChild(tag);
		let player;

		window.onYouTubeIframeAPIReady = () => {
			player = new YT.Player("jamz",
			{
					events: {
						onReady: e => {
							console.log("ready", e);
							target = e.target;
						}
					}
				});
		};
	});

	return [didClick, handleJamz];
}

class Jamz extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$4, safe_not_equal, {});
	}
}

/* src\Icons.svelte generated by Svelte v3.19.1 */

function create_fragment$5(ctx) {
	let div;
	let svg0;
	let path0;
	let t0;
	let svg1;
	let path1;
	let t1;
	let svg2;
	let path2;
	let t2;
	let svg3;
	let path3;

	return {
		c() {
			div = element("div");
			svg0 = svg_element("svg");
			path0 = svg_element("path");
			t0 = space();
			svg1 = svg_element("svg");
			path1 = svg_element("path");
			t1 = space();
			svg2 = svg_element("svg");
			path2 = svg_element("path");
			t2 = space();
			svg3 = svg_element("svg");
			path3 = svg_element("path");
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { style: true });
			var div_nodes = children(div);
			svg0 = claim_element(div_nodes, "svg", { id: true, viewBox: true }, 1);
			var svg0_nodes = children(svg0);
			path0 = claim_element(svg0_nodes, "path", { fill: true, style: true, d: true }, 1);
			children(path0).forEach(detach);
			svg0_nodes.forEach(detach);
			t0 = claim_space(div_nodes);
			svg1 = claim_element(div_nodes, "svg", { id: true, viewBox: true }, 1);
			var svg1_nodes = children(svg1);
			path1 = claim_element(svg1_nodes, "path", { fill: true, style: true, d: true }, 1);
			children(path1).forEach(detach);
			svg1_nodes.forEach(detach);
			t1 = claim_space(div_nodes);
			svg2 = claim_element(div_nodes, "svg", { id: true, viewBox: true }, 1);
			var svg2_nodes = children(svg2);
			path2 = claim_element(svg2_nodes, "path", { fill: true, d: true }, 1);
			children(path2).forEach(detach);
			svg2_nodes.forEach(detach);
			t2 = claim_space(div_nodes);
			svg3 = claim_element(div_nodes, "svg", { id: true, viewBox: true }, 1);
			var svg3_nodes = children(svg3);
			path3 = claim_element(svg3_nodes, "path", { fill: true, style: true, d: true }, 1);
			children(path3).forEach(detach);
			svg3_nodes.forEach(detach);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path0, "fill", "#1ed760");
			set_style(path0, "fill", "#1ed760");
			attr(path0, "d", "M16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.12-16-16-16zM23.361 23.12c-0.32 0.479-0.88 0.64-1.361 0.32-3.76-2.32-8.48-2.801-14.081-1.521-0.557 0.163-1.039-0.239-1.199-0.719-0.16-0.561 0.24-1.040 0.72-1.2 6.080-1.361 11.36-0.8 15.52 1.76 0.56 0.24 0.639 0.879 0.401 1.36zM25.281 18.72c-0.401 0.56-1.121 0.8-1.683 0.4-4.319-2.64-10.879-3.44-15.919-1.84-0.639 0.16-1.36-0.16-1.52-0.8s0.16-1.361 0.8-1.521c5.84-1.759 13.040-0.877 18 2.161 0.481 0.241 0.72 1.040 0.321 1.6zM25.441 14.24c-5.121-3.040-13.681-3.36-18.561-1.839-0.8 0.239-1.6-0.241-1.84-0.961-0.24-0.801 0.24-1.6 0.96-1.841 5.68-1.68 15.040-1.36 20.961 2.161 0.719 0.4 0.959 1.36 0.559 2.080-0.399 0.561-1.36 0.799-2.079 0.4z");
			attr(svg0, "id", "icon-spotify");
			attr(svg0, "viewBox", "0 0 32 32");
			attr(path1, "fill", "#f30");
			set_style(path1, "fill", "#f30");
			attr(path1, "d", "M1.567 16.3c-0.068 0-0.125 0.061-0.135 0.133l-0.311 2.872 0.311 2.807c0.009 0.077 0.067 0.131 0.135 0.131 0.067 0 0.12-0.053 0.132-0.131l0.34-2.807-0.36-2.872c0-0.076-0.060-0.133-0.12-0.133zM0.36 17.404c-0.080 0-0.121 0.049-0.139 0.125l-0.221 1.776 0.22 1.744c0 0.073 0.060 0.125 0.12 0.125s0.119-0.060 0.139-0.139l0.28-1.759-0.28-1.779c0-0.081-0.059-0.12-0.12-0.12zM2.799 15.74c-0.081 0-0.16 0.060-0.16 0.139l-0.28 3.417 0.3 3.277c0 0.080 0.060 0.16 0.159 0.16 0.081 0 0.14-0.081 0.161-0.16l0.339-3.299-0.339-3.397c-0.021-0.080-0.081-0.16-0.161-0.16zM4.077 15.599c-0.1 0-0.18 0.080-0.2 0.18l-0.257 3.52 0.28 3.392c0.021 0.103 0.1 0.184 0.199 0.184 0.1 0 0.18-0.081 0.2-0.2l0.32-3.376-0.32-3.497c0-0.1-0.080-0.18-0.18-0.18zM5.617 16.079c-0.007-0.12-0.1-0.199-0.212-0.199-0.12 0-0.211 0.080-0.219 0.199l-0.289 3.24 0.267 3.417c0 0.12 0.1 0.209 0.212 0.209 0.099 0 0.197-0.091 0.197-0.211l0.303-3.417-0.303-3.259zM6.696 13.8c-0.135 0-0.24 0.12-0.24 0.241l-0.28 5.276 0.249 3.417c0 0.12 0.107 0.219 0.24 0.219 0.125 0 0.232-0.12 0.24-0.24l0.279-3.417-0.279-5.296c-0.011-0.139-0.117-0.24-0.24-0.24zM7.944 12.541c-0.14 0-0.26 0.12-0.271 0.259l-0.24 6.496 0.22 3.397c0 0.16 0.12 0.279 0.26 0.279 0.139 0 0.259-0.119 0.28-0.279l0.257-3.397-0.256-6.475c-0.021-0.16-0.14-0.28-0.28-0.28zM9.233 11.943c-0.161 0-0.281 0.119-0.3 0.279l-0.22 7.033 0.22 3.36c0.019 0.159 0.139 0.3 0.3 0.3 0.159 0 0.3-0.14 0.3-0.3l0.26-3.36-0.261-7.033c0-0.16-0.14-0.3-0.3-0.3zM10.892 11.981c0-0.18-0.14-0.32-0.32-0.32-0.159 0-0.32 0.14-0.32 0.32l-0.199 7.255 0.199 3.337c0.021 0.18 0.161 0.32 0.341 0.32s0.32-0.14 0.32-0.32l0.219-3.337-0.219-7.275zM11.891 11.803c-0.18 0-0.34 0.159-0.34 0.339l-0.2 7.096 0.2 3.297c0 0.2 0.16 0.34 0.34 0.34s0.34-0.16 0.34-0.36l0.2-3.299-0.22-7.076c0-0.197-0.16-0.36-0.361-0.36zM13.189 12.001c-0.219 0-0.379 0.18-0.379 0.38l-0.137 6.857 0.18 3.299c0 0.199 0.159 0.369 0.379 0.369 0.199 0 0.361-0.16 0.379-0.38l0.161-3.257-0.18-6.816c-0.016-0.219-0.18-0.38-0.38-0.38zM14.791 10.813c-0.060-0.039-0.14-0.059-0.22-0.059s-0.159 0.020-0.22 0.059c-0.12 0.072-0.199 0.2-0.199 0.34v0.081l-0.139 8.064 0.153 3.265v0.011c0.011 0.080 0.040 0.18 0.099 0.24 0.077 0.081 0.189 0.139 0.312 0.139 0.107 0 0.211-0.059 0.279-0.12 0.077-0.080 0.121-0.18 0.121-0.3l0.020-0.32 0.156-2.937-0.18-8.115c0-0.139-0.081-0.257-0.18-0.319zM16.132 10.084c-0.060-0.060-0.12-0.081-0.2-0.081-0.099 0-0.199 0.021-0.279 0.081-0.1 0.081-0.159 0.2-0.159 0.32v0.039l-0.183 8.812 0.101 1.62 0.081 1.58c0 0.219 0.197 0.419 0.437 0.419 0.241 0 0.44-0.2 0.44-0.439l0.2-3.219-0.2-8.849c0-0.16-0.099-0.295-0.22-0.369zM28.064 15.033c-0.54 0-1.060 0.115-1.519 0.309-0.32-3.539-3.28-6.315-6.917-6.315-0.879 0-1.74 0.18-2.519 0.479-0.3 0.12-0.36 0.24-0.38 0.479v12.491c0.021 0.24 0.2 0.44 0.44 0.46h10.913c2.159 0.021 3.917-1.717 3.917-3.896s-1.759-3.936-3.917-3.936z");
			attr(svg1, "id", "icon-soundcloud");
			attr(svg1, "viewBox", "0 0 32 32");
			attr(path2, "fill", "#fff");
			attr(path2, "d", "M16 0.396c-8.84 0-16 7.164-16 16 0 7.071 4.584 13.067 10.94 15.18 0.8 0.151 1.093-0.344 1.093-0.769 0-0.38-0.013-1.387-0.020-2.72-4.451 0.965-5.389-2.147-5.389-2.147-0.728-1.847-1.78-2.34-1.78-2.34-1.449-0.992 0.112-0.972 0.112-0.972 1.607 0.112 2.451 1.648 2.451 1.648 1.427 2.447 3.745 1.74 4.66 1.331 0.144-1.035 0.556-1.74 1.013-2.14-3.553-0.4-7.288-1.776-7.288-7.907 0-1.747 0.62-3.173 1.647-4.293-0.18-0.404-0.72-2.031 0.14-4.235 0 0 1.34-0.429 4.4 1.64 1.28-0.356 2.64-0.532 4-0.54 1.36 0.008 2.72 0.184 4 0.54 3.040-2.069 4.38-1.64 4.38-1.64 0.86 2.204 0.32 3.831 0.16 4.235 1.020 1.12 1.64 2.547 1.64 4.293 0 6.147-3.74 7.5-7.3 7.893 0.56 0.48 1.080 1.461 1.080 2.96 0 2.141-0.020 3.861-0.020 4.381 0 0.42 0.28 0.92 1.1 0.76 6.401-2.099 10.981-8.099 10.981-15.159 0-8.836-7.164-16-16-16z");
			attr(svg2, "id", "icon-github");
			attr(svg2, "viewBox", "0 0 32 32");
			attr(path3, "fill", "#0077b5");
			set_style(path3, "fill", "var(--color1, #0077b5)");
			attr(path3, "d", "M27.263 27.269h-4.739v-7.425c0-1.771-0.036-4.049-2.469-4.049-2.471 0-2.848 1.927-2.848 3.919v7.556h-4.739v-15.269h4.552v2.081h0.061c0.636-1.2 2.183-2.467 4.493-2.467 4.801 0 5.689 3.16 5.689 7.273zM7.116 9.911c-1.525 0-2.751-1.235-2.751-2.753 0-1.517 1.227-2.751 2.751-2.751 1.52 0 2.752 1.233 2.752 2.751 0 1.519-1.233 2.753-2.752 2.753zM9.492 27.269h-4.752v-15.269h4.752zM29.633 0h-27.272c-1.305 0-2.361 1.032-2.361 2.305v27.389c0 1.275 1.056 2.305 2.361 2.305h27.268c1.304 0 2.371-1.031 2.371-2.305v-27.389c0-1.273-1.067-2.305-2.371-2.305z");
			attr(svg3, "id", "icon-linkedin");
			attr(svg3, "viewBox", "0 0 32 32");
			set_style(div, "display", "none");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, svg0);
			append(svg0, path0);
			append(div, t0);
			append(div, svg1);
			append(svg1, path1);
			append(div, t1);
			append(div, svg2);
			append(svg2, path2);
			append(div, t2);
			append(div, svg3);
			append(svg3, path3);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

class Icons extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$5, safe_not_equal, {});
	}
}

/* src\App.svelte generated by Svelte v3.19.1 */

function create_fragment$6(ctx) {
	let main;
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let current;
	const stylesheet = new Stylesheet({});
	const header = new Header({});
	const projects = new Projects({});
	const footer = new Footer({});
	const jamz = new Jamz({});
	const icons = new Icons({});

	return {
		c() {
			main = element("main");
			create_component(stylesheet.$$.fragment);
			t0 = space();
			create_component(header.$$.fragment);
			t1 = space();
			create_component(projects.$$.fragment);
			t2 = space();
			create_component(footer.$$.fragment);
			t3 = space();
			create_component(jamz.$$.fragment);
			t4 = space();
			create_component(icons.$$.fragment);
			this.h();
		},
		l(nodes) {
			main = claim_element(nodes, "MAIN", { class: true });
			var main_nodes = children(main);
			claim_component(stylesheet.$$.fragment, main_nodes);
			t0 = claim_space(main_nodes);
			claim_component(header.$$.fragment, main_nodes);
			t1 = claim_space(main_nodes);
			claim_component(projects.$$.fragment, main_nodes);
			t2 = claim_space(main_nodes);
			claim_component(footer.$$.fragment, main_nodes);
			t3 = claim_space(main_nodes);
			claim_component(jamz.$$.fragment, main_nodes);
			t4 = claim_space(main_nodes);
			claim_component(icons.$$.fragment, main_nodes);
			main_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(main, "class", "svelte-6rwaq7");
		},
		m(target, anchor) {
			insert(target, main, anchor);
			mount_component(stylesheet, main, null);
			append(main, t0);
			mount_component(header, main, null);
			append(main, t1);
			mount_component(projects, main, null);
			append(main, t2);
			mount_component(footer, main, null);
			append(main, t3);
			mount_component(jamz, main, null);
			append(main, t4);
			mount_component(icons, main, null);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(stylesheet.$$.fragment, local);
			transition_in(header.$$.fragment, local);
			transition_in(projects.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			transition_in(jamz.$$.fragment, local);
			transition_in(icons.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(stylesheet.$$.fragment, local);
			transition_out(header.$$.fragment, local);
			transition_out(projects.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			transition_out(jamz.$$.fragment, local);
			transition_out(icons.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(main);
			destroy_component(stylesheet);
			destroy_component(header);
			destroy_component(projects);
			destroy_component(footer);
			destroy_component(jamz);
			destroy_component(icons);
		}
	};
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$6, safe_not_equal, {});
	}
}

export default App;
