
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
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
            set_current_component(null);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.30.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Icon.svelte generated by Svelte v3.30.0 */

    const file = "src\\Icon.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let path_1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(path_1, "stroke", /*outline*/ ctx[0]);
    			attr_dev(path_1, "stroke-width", /*strokeWidth*/ ctx[4]);
    			attr_dev(path_1, "stroke-linecap", "round");
    			attr_dev(path_1, "stroke-linejoin", "round");
    			attr_dev(path_1, "d", /*path*/ ctx[1]);
    			add_location(path_1, file, 24, 4, 678);
    			attr_dev(svg, "class", "icon svelte-1y3v126");
    			attr_dev(svg, "width", /*width*/ ctx[2]);
    			attr_dev(svg, "height", /*height*/ ctx[3]);
    			attr_dev(svg, "fill", /*fill*/ ctx[6]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[5]);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file, 23, 0, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*handleClicks*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*outline*/ 1) {
    				attr_dev(path_1, "stroke", /*outline*/ ctx[0]);
    			}

    			if (dirty & /*strokeWidth*/ 16) {
    				attr_dev(path_1, "stroke-width", /*strokeWidth*/ ctx[4]);
    			}

    			if (dirty & /*path*/ 2) {
    				attr_dev(path_1, "d", /*path*/ ctx[1]);
    			}

    			if (dirty & /*width*/ 4) {
    				attr_dev(svg, "width", /*width*/ ctx[2]);
    			}

    			if (dirty & /*height*/ 8) {
    				attr_dev(svg, "height", /*height*/ ctx[3]);
    			}

    			if (dirty & /*fill*/ 64) {
    				attr_dev(svg, "fill", /*fill*/ ctx[6]);
    			}

    			if (dirty & /*viewBox*/ 32) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { path } = $$props;
    	let { color = "none" } = $$props;
    	let { outline = "#000" } = $$props;
    	let { width = "40" } = $$props;
    	let { height = "40" } = $$props;
    	let { strokeWidth = "5" } = $$props;
    	let { viewBox = "0 0 150 150" } = $$props;

    	let { onclick = () => {
    		
    	} } = $$props;

    	function toggleColor() {
    		$$invalidate(6, fill = fill === "none" ? color : "none");
    		$$invalidate(0, outline = fill === "none" ? "#000" : color);
    	}

    	function handleClicks() {
    		onclick();
    		toggleColor();
    	}

    	const writable_props = [
    		"path",
    		"color",
    		"outline",
    		"width",
    		"height",
    		"strokeWidth",
    		"viewBox",
    		"onclick"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("path" in $$props) $$invalidate(1, path = $$props.path);
    		if ("color" in $$props) $$invalidate(8, color = $$props.color);
    		if ("outline" in $$props) $$invalidate(0, outline = $$props.outline);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("strokeWidth" in $$props) $$invalidate(4, strokeWidth = $$props.strokeWidth);
    		if ("viewBox" in $$props) $$invalidate(5, viewBox = $$props.viewBox);
    		if ("onclick" in $$props) $$invalidate(9, onclick = $$props.onclick);
    	};

    	$$self.$capture_state = () => ({
    		path,
    		color,
    		outline,
    		width,
    		height,
    		strokeWidth,
    		viewBox,
    		onclick,
    		toggleColor,
    		handleClicks,
    		fill
    	});

    	$$self.$inject_state = $$props => {
    		if ("path" in $$props) $$invalidate(1, path = $$props.path);
    		if ("color" in $$props) $$invalidate(8, color = $$props.color);
    		if ("outline" in $$props) $$invalidate(0, outline = $$props.outline);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("strokeWidth" in $$props) $$invalidate(4, strokeWidth = $$props.strokeWidth);
    		if ("viewBox" in $$props) $$invalidate(5, viewBox = $$props.viewBox);
    		if ("onclick" in $$props) $$invalidate(9, onclick = $$props.onclick);
    		if ("fill" in $$props) $$invalidate(6, fill = $$props.fill);
    	};

    	let fill;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(6, fill = "none");

    	return [
    		outline,
    		path,
    		width,
    		height,
    		strokeWidth,
    		viewBox,
    		fill,
    		handleClicks,
    		color,
    		onclick
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			path: 1,
    			color: 8,
    			outline: 0,
    			width: 2,
    			height: 3,
    			strokeWidth: 4,
    			viewBox: 5,
    			onclick: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*path*/ ctx[1] === undefined && !("path" in props)) {
    			console.warn("<Icon> was created without expected prop 'path'");
    		}
    	}

    	get path() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onclick() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onclick(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const icons = {
        heart: {
            path: "M73.86,60.92a29.28,29.28,0,0,0-41.42,0h0a29.28,29.28,0,0,0,0,41.42l41.42,41.42h0l41.43-41.42a29.3,29.3,0,0,0,0-41.42h0a29.3,29.3,0,0,0-41.43,0",
            viewBox: "0 20 150 150",
            color: "#e01f49"
        },
        comment: {
            path: "M100,50A49.85,49.85,0,0,1,83.75,86.89c-2.29,2.1,7.3,19.91,4.65,21.55S70.83,95.58,67.86,96.72A50,50,0,1,1,100,50Z",
            viewBox: "-30 -15 165 140"
        },
        bookmark: {
            path: "M84.36,96.52l-40-32.71a1.83,1.83,0,0,0-2.35,0L3,96.46A1.85,1.85,0,0,1,0,95V1.85A1.85,1.85,0,0,1,1.85,0H85.53a1.84,1.84,0,0,1,1.84,1.85V95.1A1.84,1.84,0,0,1,84.36,96.52Z",
            viewBox: "-35 -30 160 160"
        },
    };

    /* src\Post.svelte generated by Svelte v3.30.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\Post.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (108:12) {:else}
    function create_else_block_1(ctx) {
    	let t0;
    	let t1;
    	let t2_value = (/*likes*/ ctx[1] === 1 ? "like" : "likes") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(/*likes*/ ctx[1]);
    			t1 = space();
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*likes*/ 2) set_data_dev(t0, /*likes*/ ctx[1]);
    			if (dirty & /*likes*/ 2 && t2_value !== (t2_value = (/*likes*/ ctx[1] === 1 ? "like" : "likes") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(108:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (106:12) {#if isAd}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Everyone likes this.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(106:12) {#if isAd}",
    		ctx
    	});

    	return block;
    }

    // (124:12) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Be the first to comment...";
    			attr_dev(p, "class", "hint svelte-16tnh5c");
    			add_location(p, file$1, 124, 16, 3561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(124:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:12) {#if comments.length > 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*comments*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*comments*/ 8) {
    				each_value = /*comments*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(117:12) {#if comments.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (118:16) {#each comments as comment}
    function create_each_block(ctx) {
    	let p;
    	let b;
    	let t0_value = /*comment*/ ctx[25].username + "";
    	let t0;
    	let t1;
    	let t2_value = /*comment*/ ctx[25].text + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(b, "class", "svelte-16tnh5c");
    			add_location(b, file$1, 119, 20, 3414);
    			attr_dev(p, "class", "username svelte-16tnh5c");
    			add_location(p, file$1, 118, 16, 3372);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*comments*/ 8 && t0_value !== (t0_value = /*comment*/ ctx[25].username + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*comments*/ 8 && t2_value !== (t2_value = /*comment*/ ctx[25].text + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(118:16) {#each comments as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let article;
    	let header;
    	let div0;
    	let t0;
    	let b0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let button;
    	let t5;
    	let canvas_1;
    	let t6;
    	let t7;
    	let footer;
    	let icon0;
    	let t8;
    	let icon1;
    	let t9;
    	let div2;
    	let t10;
    	let icon2;
    	let t11;
    	let div4;
    	let b1;
    	let t12;
    	let p;
    	let b2;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	const icon0_spread_levels = [{ onclick: /*toggleLike*/ ctx[9] }, icons.heart];
    	let icon0_props = {};

    	for (let i = 0; i < icon0_spread_levels.length; i += 1) {
    		icon0_props = assign(icon0_props, icon0_spread_levels[i]);
    	}

    	icon0 = new Icon({ props: icon0_props, $$inline: true });
    	const icon1_spread_levels = [icons.comment];
    	let icon1_props = {};

    	for (let i = 0; i < icon1_spread_levels.length; i += 1) {
    		icon1_props = assign(icon1_props, icon1_spread_levels[i]);
    	}

    	icon1 = new Icon({ props: icon1_props, $$inline: true });
    	const icon2_spread_levels = [icons.bookmark];
    	let icon2_props = {};

    	for (let i = 0; i < icon2_spread_levels.length; i += 1) {
    		icon2_props = assign(icon2_props, icon2_spread_levels[i]);
    	}

    	icon2 = new Icon({ props: icon2_props, $$inline: true });

    	function select_block_type(ctx, dirty) {
    		if (/*isAd*/ ctx[4]) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*comments*/ ctx[3].length > 0) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			div0 = element("div");
    			t0 = space();
    			b0 = element("b");
    			t1 = text(/*username*/ ctx[2]);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			button = element("button");
    			button.textContent = "...";
    			t5 = space();
    			canvas_1 = element("canvas");
    			t6 = text("Your browser does not support canvas elements.");
    			t7 = space();
    			footer = element("footer");
    			create_component(icon0.$$.fragment);
    			t8 = space();
    			create_component(icon1.$$.fragment);
    			t9 = space();
    			div2 = element("div");
    			t10 = space();
    			create_component(icon2.$$.fragment);
    			t11 = space();
    			div4 = element("div");
    			b1 = element("b");
    			if_block0.c();
    			t12 = space();
    			p = element("p");
    			b2 = element("b");
    			t13 = text(/*username*/ ctx[2]);
    			t14 = space();
    			t15 = text(/*caption*/ ctx[0]);
    			t16 = space();
    			div3 = element("div");
    			if_block1.c();
    			attr_dev(div0, "class", "imgCont profilePic svelte-16tnh5c");
    			add_location(div0, file$1, 83, 8, 2263);
    			attr_dev(b0, "class", "svelte-16tnh5c");
    			add_location(b0, file$1, 85, 8, 2321);
    			attr_dev(div1, "class", "spacer svelte-16tnh5c");
    			add_location(div1, file$1, 86, 8, 2348);
    			attr_dev(button, "class", "svelte-16tnh5c");
    			add_location(button, file$1, 87, 8, 2384);
    			attr_dev(header, "class", "svelte-16tnh5c");
    			add_location(header, file$1, 82, 4, 2245);
    			set_style(canvas_1, "background-image", "url(" + /*trueSource*/ ctx[8] + ")");
    			attr_dev(canvas_1, "width", "400");
    			attr_dev(canvas_1, "height", "300");
    			attr_dev(canvas_1, "class", "imgCont postImage svelte-16tnh5c");
    			add_location(canvas_1, file$1, 89, 4, 2425);
    			attr_dev(div2, "class", "spacer svelte-16tnh5c");
    			add_location(div2, file$1, 100, 8, 2821);
    			attr_dev(footer, "class", "svelte-16tnh5c");
    			add_location(footer, file$1, 97, 4, 2712);
    			attr_dev(b1, "class", "likes svelte-16tnh5c");
    			add_location(b1, file$1, 104, 8, 2933);
    			attr_dev(b2, "class", "svelte-16tnh5c");
    			add_location(b2, file$1, 112, 12, 3176);
    			attr_dev(p, "class", "username caption svelte-16tnh5c");
    			add_location(p, file$1, 111, 8, 3134);
    			attr_dev(div3, "class", "comments preview svelte-16tnh5c");
    			add_location(div3, file$1, 115, 8, 3240);
    			attr_dev(div4, "class", "info svelte-16tnh5c");
    			add_location(div4, file$1, 103, 4, 2905);
    			attr_dev(article, "style", /*style*/ ctx[5]);
    			attr_dev(article, "class", "svelte-16tnh5c");
    			add_location(article, file$1, 81, 0, 2199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, div0);
    			append_dev(header, t0);
    			append_dev(header, b0);
    			append_dev(b0, t1);
    			append_dev(header, t2);
    			append_dev(header, div1);
    			append_dev(header, t3);
    			append_dev(header, button);
    			append_dev(article, t5);
    			append_dev(article, canvas_1);
    			append_dev(canvas_1, t6);
    			/*canvas_1_binding*/ ctx[15](canvas_1);
    			append_dev(article, t7);
    			append_dev(article, footer);
    			mount_component(icon0, footer, null);
    			append_dev(footer, t8);
    			mount_component(icon1, footer, null);
    			append_dev(footer, t9);
    			append_dev(footer, div2);
    			append_dev(footer, t10);
    			mount_component(icon2, footer, null);
    			append_dev(article, t11);
    			append_dev(article, div4);
    			append_dev(div4, b1);
    			if_block0.m(b1, null);
    			append_dev(div4, t12);
    			append_dev(div4, p);
    			append_dev(p, b2);
    			append_dev(b2, t13);
    			append_dev(p, t14);
    			append_dev(p, t15);
    			append_dev(div4, t16);
    			append_dev(div4, div3);
    			if_block1.m(div3, null);
    			/*article_binding*/ ctx[16](article);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(canvas_1, "click", /*crackScreen*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*username*/ 4) set_data_dev(t1, /*username*/ ctx[2]);

    			const icon0_changes = (dirty & /*toggleLike, Icons*/ 512)
    			? get_spread_update(icon0_spread_levels, [
    					dirty & /*toggleLike*/ 512 && { onclick: /*toggleLike*/ ctx[9] },
    					dirty & /*Icons*/ 0 && get_spread_object(icons.heart)
    				])
    			: {};

    			icon0.$set(icon0_changes);

    			const icon1_changes = (dirty & /*Icons*/ 0)
    			? get_spread_update(icon1_spread_levels, [get_spread_object(icons.comment)])
    			: {};

    			icon1.$set(icon1_changes);

    			const icon2_changes = (dirty & /*Icons*/ 0)
    			? get_spread_update(icon2_spread_levels, [get_spread_object(icons.bookmark)])
    			: {};

    			icon2.$set(icon2_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(b1, null);
    				}
    			}

    			if (!current || dirty & /*username*/ 4) set_data_dev(t13, /*username*/ ctx[2]);
    			if (!current || dirty & /*caption*/ 1) set_data_dev(t15, /*caption*/ ctx[0]);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (!current || dirty & /*style*/ 32) {
    				attr_dev(article, "style", /*style*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			/*canvas_1_binding*/ ctx[15](null);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			if_block0.d();
    			if_block1.d();
    			/*article_binding*/ ctx[16](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const imgPrefix = "./images/";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Post", slots, []);
    	let { username } = $$props;
    	let { imgSource } = $$props;
    	let { caption = "" } = $$props;
    	let { likes = 0 } = $$props;
    	let { comments = [] } = $$props;
    	let { isAd = false } = $$props;
    	let { isLiked = false } = $$props;
    	let { realitySource = "" } = $$props;
    	let { realityCaption = "" } = $$props;
    	let { style = "" } = $$props;
    	const fixImgPath = src => imgPrefix + src;
    	let trueSource = fixImgPath(imgSource);
    	let trueRealitySource = fixImgPath(realitySource);
    	let oldCaption = caption;
    	let crack = new Image();
    	crack.src = "./images/crack1.png";

    	function toggleLike() {
    		$$invalidate(1, likes = parseInt(likes) + 2 * (!isLiked - 0.5));
    		$$invalidate(11, isLiked = !isLiked);
    	}

    	

    	function getMousePos(e) {
    		let rect = canvas.getBoundingClientRect();
    		let x = e.clientX - rect.left;
    		let y = e.clientY - rect.top;
    		return [x, y];
    	}

    	function crackScreen(e) {
    		let [x, y] = getMousePos(e);
    		const width = 300;
    		const height = 150;
    		console.log(`X: ${x}, Y: ${y}, w: ${width}, h: ${height}`);
    		let context = canvas.getContext("2d");
    		context.drawImage(crack, x - width / 2, y - height / 2, width, height);
    	}

    	// bindings
    	let canvas;

    	let post;

    	const setCanvasBG = url => {
    		$$invalidate(6, canvas.style.backgroundImage = `url('${url}')`, canvas);
    	};

    	const callback = entries => {
    		if (entries[0].isIntersecting && realitySource != "") {
    			setCanvasBG(trueRealitySource);

    			if (realityCaption != "") {
    				$$invalidate(0, caption = realityCaption);
    			}

    			setTimeout(
    				() => {
    					setCanvasBG(trueSource);
    					$$invalidate(0, caption = oldCaption);
    				},
    				300
    			);
    		}
    	};

    	const options = { threshold: 1 };

    	onMount(() => {
    		const observer = new IntersectionObserver(callback, options);
    		observer.observe(post);
    	});

    	const writable_props = [
    		"username",
    		"imgSource",
    		"caption",
    		"likes",
    		"comments",
    		"isAd",
    		"isLiked",
    		"realitySource",
    		"realityCaption",
    		"style"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvas = $$value;
    			$$invalidate(6, canvas);
    		});
    	}

    	function article_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			post = $$value;
    			$$invalidate(7, post);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("username" in $$props) $$invalidate(2, username = $$props.username);
    		if ("imgSource" in $$props) $$invalidate(12, imgSource = $$props.imgSource);
    		if ("caption" in $$props) $$invalidate(0, caption = $$props.caption);
    		if ("likes" in $$props) $$invalidate(1, likes = $$props.likes);
    		if ("comments" in $$props) $$invalidate(3, comments = $$props.comments);
    		if ("isAd" in $$props) $$invalidate(4, isAd = $$props.isAd);
    		if ("isLiked" in $$props) $$invalidate(11, isLiked = $$props.isLiked);
    		if ("realitySource" in $$props) $$invalidate(13, realitySource = $$props.realitySource);
    		if ("realityCaption" in $$props) $$invalidate(14, realityCaption = $$props.realityCaption);
    		if ("style" in $$props) $$invalidate(5, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({
    		Icons: icons,
    		App,
    		Icon,
    		onMount,
    		username,
    		imgSource,
    		caption,
    		likes,
    		comments,
    		isAd,
    		isLiked,
    		realitySource,
    		realityCaption,
    		style,
    		imgPrefix,
    		fixImgPath,
    		trueSource,
    		trueRealitySource,
    		oldCaption,
    		crack,
    		toggleLike,
    		getMousePos,
    		crackScreen,
    		canvas,
    		post,
    		setCanvasBG,
    		callback,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ("username" in $$props) $$invalidate(2, username = $$props.username);
    		if ("imgSource" in $$props) $$invalidate(12, imgSource = $$props.imgSource);
    		if ("caption" in $$props) $$invalidate(0, caption = $$props.caption);
    		if ("likes" in $$props) $$invalidate(1, likes = $$props.likes);
    		if ("comments" in $$props) $$invalidate(3, comments = $$props.comments);
    		if ("isAd" in $$props) $$invalidate(4, isAd = $$props.isAd);
    		if ("isLiked" in $$props) $$invalidate(11, isLiked = $$props.isLiked);
    		if ("realitySource" in $$props) $$invalidate(13, realitySource = $$props.realitySource);
    		if ("realityCaption" in $$props) $$invalidate(14, realityCaption = $$props.realityCaption);
    		if ("style" in $$props) $$invalidate(5, style = $$props.style);
    		if ("trueSource" in $$props) $$invalidate(8, trueSource = $$props.trueSource);
    		if ("trueRealitySource" in $$props) trueRealitySource = $$props.trueRealitySource;
    		if ("oldCaption" in $$props) oldCaption = $$props.oldCaption;
    		if ("crack" in $$props) crack = $$props.crack;
    		if ("canvas" in $$props) $$invalidate(6, canvas = $$props.canvas);
    		if ("post" in $$props) $$invalidate(7, post = $$props.post);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		caption,
    		likes,
    		username,
    		comments,
    		isAd,
    		style,
    		canvas,
    		post,
    		trueSource,
    		toggleLike,
    		crackScreen,
    		isLiked,
    		imgSource,
    		realitySource,
    		realityCaption,
    		canvas_1_binding,
    		article_binding
    	];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			username: 2,
    			imgSource: 12,
    			caption: 0,
    			likes: 1,
    			comments: 3,
    			isAd: 4,
    			isLiked: 11,
    			realitySource: 13,
    			realityCaption: 14,
    			style: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[2] === undefined && !("username" in props)) {
    			console_1.warn("<Post> was created without expected prop 'username'");
    		}

    		if (/*imgSource*/ ctx[12] === undefined && !("imgSource" in props)) {
    			console_1.warn("<Post> was created without expected prop 'imgSource'");
    		}
    	}

    	get username() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgSource() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgSource(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get likes() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set likes(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get comments() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set comments(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isAd() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAd(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLiked() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLiked(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get realitySource() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set realitySource(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get realityCaption() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set realityCaption(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Comment {
       constructor(username, text) {
           this.username = username;
           this.text = text;
       }
    }

    const usernames = ["Mark Wentley", "Hayley Bosnin",
                   "Chuck M.", "Marilyn M.", "Mike Ranchsmith", 
                   "Jave Ramirez", "James Marvin", "Caroline Beckett"
    ];

    const comments = [
        "Beautiful!", "Brave", "You are so inspiring", "Oh my god, yes!",
        "This is what the world needs more of.", "I wish I was you.", "Keep being yourself!",
        "I couldn't have said it better myself.", "Gorgeous!!!"
    ];

    const emojis = ['❤️', '😭', '🥺', '✨', '😍', '🙏'];

    const random = arr => { 
        return arr[Math.floor(Math.random() * arr.length)];
    };

    const randomComments = (numComments, ignoreUsers = []) => {
        let all = [];
        let usrs = usernames.filter(name => !ignoreUsers.includes(name));
        for (let i = 0; i < numComments; i++) {
            all.push(
                new Comment(random(usrs), random(comments) + random(emojis)));
        }
        return all;
    };

    const Posts = [
        {
            username: "Sarah Lynn",
            caption: "Life didn't exist before the sea 🌊. Hey everyone, I know life can be unfair sometimes. I've been going through some stuff, and it makes me feel greta knowing you all have my back.",
            likes: 13,
            imgSource: "sea.jpg",
            comments: [
                new Comment("James Marvin", "Hey Sarah, maybe this isn't the place for that kinda thing?"),
                new Comment("Caroline Beckett", "Not gonna lie Sarah that's a l'il much. Can't even spell \"great\" correctly LOL"),
                new Comment("Jave Ramirez", "Yeah... yikes 💀"),
            ]
        },
        {
            username: "James Marvin",
            caption: "I've never been happier",
            likes: 139,
            imgSource: "red-shirt.jpg",
            comments: randomComments(3, "James Marvin")
        },
        {
            username: "Jave Ramirez",
            caption: "Me and all my friends 😂",
            likes: 210,
            imgSource: "bench.jpg",
            comments: randomComments(3, "Jave Ramirez")
        },
        {
            username: "Sarah Lynn",
            caption: "This is what life was meant to be :)",
            likes: 210,
            imgSource: "yellow-shirt.jpg",
            realitySource: "crying.jpg",
            comments: randomComments(3)
        },
        {
            username: "Caroline Beckett",
            caption: "Highway to hell!",
            likes: 301,
            imgSource: "yoga.jpg",
            comments: randomComments(3, "Caroline Beckett")
        },
        {
            username: "Sarah Lynn",
            caption: "I'm feelin ~~alive~~",
            likes: 270,
            imgSource: "smile.jpg",
            realitySource: "pills.jpg",
            comments: [new Comment("Caroline Beckett", "See, you didn't have to be such an attention whore earlier 😘"),
                       new Comment("Jave Ramirez", "True Caroline 😭"),
                        ...randomComments(2, ["Jave Ramirez", "Caroline Beckett"])    
            ]
        },
        {
            username: "Caroline Beckett",
            caption: "Love these goons!",
            likes: 345,
            imgSource: "yoga2.jpg",
            comments: randomComments(3, "Caroline Beckett")
        },
        {
            username: "James Marvin",
            caption: "My cowboy look makes the cowgirls swoon",
            likes: 345,
            imgSource: "hay.jpeg",
            comments: [
                new Comment("Jave Ramirez", "More like makes the cows swoon 😭"),
                new Comment("Beth Wilcox", "Psss please"),
                new Comment("Caroline Beckett", "Yeah, what a charmer 😭"),
            ]
        },
        {
            username: "Sarah Lynn",
            caption: "Smiling all the way :)",
            realityCaption: "Help me, please, somebody :(",
            likes: 301,
            imgSource: "green.jpg",
            realitySource: "drowning.jpg",
            comments: randomComments(3)
        },
        {
            username: "Jave Ramirez",
            caption: "Life could be worse ¯\\_(ツ)_/¯",
            likes: 361,
            imgSource: "jave.jpg",
            comments: [
                new Comment("James Marvin", "That dog is cuter than you could ever be."),
                new Comment("Beth Wilcox", "True Jave, you could be Sarah 😭"),
                new Comment("Caroline Beckett", "Aahahahahaha facts"),
            ]
        },
        {
            username: "Sarah Lynn",
            caption: "This world has so much pain.",
            realityCaption: "Goodbye.",
            likes: 12,
            imgSource: "black.png",
            realitySource: "bathtub.jpg",
            comments: [
                new Comment("Jave Ramirez", "???"),
                new Comment("Beth Wilcox", "You're scaring me Sarah..."),
                new Comment("Caroline Beckett", "Sarah this is a lot, even for you..."),
            ],
            style: "margin-bottom: 300px"
        },
        {
            username: "Beth Wilcox",
            caption: "Today we lost one of the brightest souls I've ever known. I know you're happier now.",
            likes: 712,
            imgSource: "fun1.jpg",
            comments: [
                new Comment("James Marvin", "RIP"),
                new Comment("Caroline Beckett", "I'm so sorry for your loss."),
            ]
        },
        {
            username: "Brittney Lynn",
            caption: "God has other plans for you, my love. You were the best sister I could have ever asked for. I feel so lost without you.",
            likes: 712,
            imgSource: "fun2.jpg",
            comments: [
                new Comment("James Marvin", "RIP"),
                new Comment("Caroline Beckett", "I'm so sorry for your loss."),
            ]
        },
        {
            username: "Jave Ramirez",
            caption: "I had known you since preschool, and this feels so raw. I never saw this coming, not from someone who was as strong as you. You continue to inspire me, Sarah.",
            likes: 839,
            imgSource: "fin.jpg",
            comments: []
        },

    ];

    /* src\App.svelte generated by Svelte v3.30.0 */
    const file$2 = "src\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (8:1) {#each posts as post}
    function create_each_block$1(ctx) {
    	let post;
    	let current;
    	const post_spread_levels = [/*post*/ ctx[0]];
    	let post_props = {};

    	for (let i = 0; i < post_spread_levels.length; i += 1) {
    		post_props = assign(post_props, post_spread_levels[i]);
    	}

    	post = new Post({ props: post_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const post_changes = (dirty & /*posts*/ 0)
    			? get_spread_update(post_spread_levels, [get_spread_object(/*post*/ ctx[0])])
    			: {};

    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:1) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current;
    	let each_value = Posts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(main, "class", "svelte-1ja6oqs");
    			add_location(main, file$2, 6, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*posts*/ 0) {
    				each_value = Posts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Icon, Post, posts: Posts });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
