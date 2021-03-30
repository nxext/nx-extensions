import Root from '../../generated/root.svelte';
import { routes, layout } from '../../generated/manifest.js';
import { f as find_anchor, g as get_base_uri } from '../chunks/utils.js';
import { writable } from 'svelte/store';
import { init } from './singletons.js';
import { set_paths } from '../paths.js';

/** @param {MouseEvent} event */
function which(event) {
	return event.which === null ? event.button : event.which;
}

function scroll_state() {
	return {
		x: pageXOffset,
		y: pageYOffset
	};
}

class Router {
	/** @param {{
	 *    base: string;
	 *    routes: import('types.internal').CSRRoute[];
	 * }} opts */
	constructor({ base, routes }) {
		this.base = base;
		this.routes = routes;

		this.history = window.history || {
			pushState: () => {},
			replaceState: () => {},
			scrollRestoration: 'auto'
		};
	}

	/** @param {import('./renderer').Renderer} renderer */
	init(renderer) {
		/** @type {import('./renderer').Renderer} */
		this.renderer = renderer;
		renderer.router = this;

		if ('scrollRestoration' in this.history) {
			this.history.scrollRestoration = 'manual';
		}

		// Adopted from Nuxt.js
		// Reset scrollRestoration to auto when leaving page, allowing page reload
		// and back-navigation from other pages to use the browser to restore the
		// scrolling position.
		addEventListener('beforeunload', () => {
			this.history.scrollRestoration = 'auto';
		});

		// Setting scrollRestoration to manual again when returning to this page.
		addEventListener('load', () => {
			this.history.scrollRestoration = 'manual';
		});

		// There's no API to capture the scroll location right before the user
		// hits the back/forward button, so we listen for scroll events

		/** @type {NodeJS.Timeout} */
		let scroll_timer;
		addEventListener('scroll', () => {
			clearTimeout(scroll_timer);
			scroll_timer = setTimeout(() => {
				// Store the scroll location in the history
				// This will persist even if we navigate away from the site and come back
				const new_state = {
					...(history.state || {}),
					'sveltekit:scroll': scroll_state()
				};
				history.replaceState(new_state, document.title, window.location.href);
			}, 50);
		});

		/** @param {MouseEvent} event */
		addEventListener('click', (event) => {
			// Adapted from https://github.com/visionmedia/page.js
			// MIT license https://github.com/visionmedia/page.js#license
			if (which(event) !== 1) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			if (event.defaultPrevented) return;

			const a = find_anchor(/** @type {Node} */ (event.target));
			if (!a) return;

			if (!a.href) return;

			// check if link is inside an svg
			// in this case, both href and target are always inside an object
			const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
			const href = String(svg ? /** @type {SVGAElement} */ (a).href.baseVal : a.href);

			if (href === location.href) {
				if (!location.hash) event.preventDefault();
				return;
			}

			// Ignore if tag has
			// 1. 'download' attribute
			// 2. rel='external' attribute
			if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

			// Ignore if <a> has a target
			if (svg ? /** @type {SVGAElement} */ (a).target.baseVal : a.target) return;

			const url = new URL(href);

			// Don't handle hash changes
			if (url.pathname === location.pathname && url.search === location.search) return;

			const info = this.parse(url);
			if (info) {
				const noscroll = a.hasAttribute('sveltekit:noscroll');
				this.history.pushState({}, '', url.href);
				this._navigate(info, noscroll ? scroll_state() : null, [], url.hash);
				event.preventDefault();
			}
		});

		addEventListener('popstate', (event) => {
			if (event.state) {
				const url = new URL(location.href);
				const info = this.parse(url);
				if (info) {
					this._navigate(info, event.state['sveltekit:scroll'], []);
				} else {
					// eslint-disable-next-line
					location.href = location.href; // nosonar
				}
			}
		});

		// make it possible to reset focus
		document.body.setAttribute('tabindex', '-1');

		// create initial history entry, so we can return here
		this.history.replaceState({}, '', location.href);
	}

	/**
	 * @param {URL} url
	 * @returns {import('./types').NavigationInfo}
	 */
	parse(url) {
		if (url.origin !== location.origin) return null;
		if (!url.pathname.startsWith(this.base)) return null;

		const path = url.pathname.slice(this.base.length) || '/';

		const routes = this.routes.filter((route) => route.pattern.test(path));

		if (routes.length > 0) {
			return {
				routes,
				path,
				query: new URLSearchParams(url.search)
			};
		}
	}

	/**
	 * @param {string} href
	 * @param {{ noscroll?: boolean, replaceState?: boolean }} opts
	 * @param {string[]} chain
	 */
	async goto(href, { noscroll = false, replaceState = false } = {}, chain) {
		const url = new URL(href, get_base_uri(document));
		const info = this.parse(url);

		if (info) {
			// TODO shouldn't need to pass the hash here
			this.history[replaceState ? 'replaceState' : 'pushState']({}, '', href);
			return this._navigate(info, noscroll ? scroll_state() : null, chain, url.hash);
		}

		location.href = href;
		return new Promise(() => {
			/* never resolves */
		});
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @param {{ x: number, y: number }} scroll
	 * @param {string[]} chain
	 * @param {string} [hash]
	 */
	async _navigate(info, scroll, chain, hash) {
		this.renderer.notify({
			path: info.path,
			query: info.query
		});

		// remove trailing slashes
		if (location.pathname.endsWith('/') && location.pathname !== '/') {
			history.replaceState({}, '', `${location.pathname.slice(0, -1)}${location.search}`);
		}

		await this.renderer.update(info, chain);

		document.body.focus();

		const deep_linked = hash && document.getElementById(hash.slice(1));
		if (scroll) {
			scrollTo(scroll.x, scroll.y);
		} else if (deep_linked) {
			// scroll is an element id (from a hash), we need to compute y
			scrollTo(0, deep_linked.getBoundingClientRect().top + scrollY);
		} else {
			scrollTo(0, 0);
		}
	}
}

/**
 * @param {import('../../types.internal').LoadOutput} loaded
 * @returns {import('../../types.internal').LoadOutput}
 */
function normalize(loaded) {
	// TODO should this behaviour be dev-only?

	if (loaded.error) {
		const error = typeof loaded.error === 'string' ? new Error(loaded.error) : loaded.error;
		const status = loaded.status;

		if (!(error instanceof Error)) {
			return {
				status: 500,
				error: new Error(
					`"error" property returned from load() must be a string or instance of Error, received type "${typeof error}"`
				)
			};
		}

		if (!status || status < 400 || status > 599) {
			console.warn('"error" returned from load() without a valid status code — defaulting to 500');
			return { status: 500, error };
		}

		return { status, error };
	}

	if (loaded.redirect) {
		if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
			return {
				status: 500,
				error: new Error(
					'"redirect" property returned from load() must be accompanied by a 3xx status code'
				)
			};
		}

		if (typeof loaded.redirect !== 'string') {
			return {
				status: 500,
				error: new Error('"redirect" property returned from load() must be a string')
			};
		}
	}

	return loaded;
}

/** @param {any} value */
function page_store(value) {
	const store = writable(value);
	let ready = true;

	function notify() {
		ready = true;
		store.update((val) => val);
	}

	/** @param {any} new_value */
	function set(new_value) {
		ready = false;
		store.set(new_value);
	}

	/** @param {(value: any) => void} run */
	function subscribe(run) {
		/** @type {any} */
		let old_value;
		return store.subscribe((new_value) => {
			if (old_value === undefined || (ready && new_value !== old_value)) {
				run((old_value = new_value));
			}
		});
	}

	return { notify, set, subscribe };
}

class Renderer {
	/** @param {{
	 *   Root: import('types.internal').CSRComponent;
	 *   layout: import('types.internal').CSRComponent;
	 *   target: Node;
	 *   session: any;
	 *   host: string;
	 * }} opts */
	constructor({ Root, layout, target, session, host }) {
		this.Root = Root;
		this.layout = layout;
		this.host = host;

		/** @type {import('./router').Router} */
		this.router = null;

		// TODO ideally we wouldn't need to store these...
		this.target = target;

		this.started = false;

		/** @type {import('./types').NavigationState} */
		this.current = {
			page: null,
			query: null,
			session_changed: false,
			nodes: [],
			contexts: []
		};

		this.caches = new Map();

		this.prefetching = {
			href: null,
			promise: null
		};

		this.stores = {
			page: page_store({}),
			navigating: writable(null),
			session: writable(session)
		};

		this.$session = null;

		this.root = null;

		/** @param {MouseEvent} event */
		const trigger_prefetch = (event) => {
			const a = find_anchor(/** @type {Node} */ (event.target));
			if (a && a.hasAttribute('sveltekit:prefetch')) {
				this.prefetch(new URL(/** @type {string} */ (a.href)));
			}
		};

		/** @type {NodeJS.Timeout} */
		let mousemove_timeout;

		/** @param {MouseEvent} event */
		const handle_mousemove = (event) => {
			clearTimeout(mousemove_timeout);
			mousemove_timeout = setTimeout(() => {
				trigger_prefetch(event);
			}, 20);
		};

		addEventListener('touchstart', trigger_prefetch);
		addEventListener('mousemove', handle_mousemove);

		let ready = false;
		this.stores.session.subscribe(async (value) => {
			this.$session = value;

			if (!ready) return;
			this.current.session_changed = true;

			const info = this.router.parse(new URL(location.href));
			this.update(info, []);
		});
		ready = true;
	}

	/**
	 * @param {import('./types').NavigationCandidate} selected
	 * @param {number} status
	 * @param {Error} error
	 */
	async start(selected, status, error) {
		/** @type {Record<string, any>} */
		const props = {
			stores: this.stores,
			error,
			status,
			page: selected.page
		};

		if (error) {
			props.components = [this.layout.default];
		} else {
			const hydrated = await this._hydrate(selected);

			if (hydrated.redirect) {
				throw new Error('TODO client-side redirects');
			}

			Object.assign(props, hydrated.props);
			this.current = hydrated.state;
		}

		// remove dev-mode SSR <style> insert, since it doesn't apply
		// to hydrated markup (HMR requires hashes to be rewritten)
		// TODO only in dev
		// TODO it seems this doesn't always work with the classname
		// stabilisation in vite-plugin-svelte? see e.g.
		// hn.svelte.dev
		// const style = document.querySelector('style[data-svelte]');
		// if (style) style.remove();

		this.root = new this.Root({
			target: this.target,
			props,
			hydrate: true
		});

		this.started = true;
	}

	/** @param {{ path: string, query: URLSearchParams }} destination */
	notify({ path, query }) {
		dispatchEvent(new CustomEvent('sveltekit:navigation-start'));

		this.stores.navigating.set({
			from: {
				path: this.current.page.path,
				query: this.current.page.query
			},
			to: {
				path,
				query
			}
		});
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @param {string[]} chain
	 */
	async update(info, chain) {
		const token = (this.token = {});
		const navigation_result = await this._get_navigation_result(info);

		// abort if user navigated during update
		if (token !== this.token) return;

		if (navigation_result.reload) {
			location.reload();
		} else if (navigation_result.redirect) {
			if (chain.length > 10 || chain.includes(this.current.page.path)) {
				this.root.$set({
					status: 500,
					error: new Error('Redirect loop')
				});
			} else {
				this.router.goto(navigation_result.redirect, { replaceState: true }, [
					...chain,
					this.current.page.path
				]);

				return;
			}
		} else {
			this.current = navigation_result.state;

			this.root.$set(navigation_result.props);
			this.stores.navigating.set(null);

			await 0;
		}

		dispatchEvent(new CustomEvent('sveltekit:navigation-end'));
	}

	/**
	 * @param {URL} url
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	async prefetch(url) {
		const info = this.router.parse(url);
		if (info) {
			if (url.href !== this.prefetching.href) {
				this.prefetching = {
					href: url.href,
					promise: this._get_navigation_result(info)
				};
			}

			return this.prefetching.promise;
		} else {
			throw new Error(`Could not prefetch ${url.href}`);
		}
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	async _get_navigation_result(info) {
		for (let i = 0; i < info.routes.length; i += 1) {
			const route = info.routes[i];

			if (route.type === 'endpoint') {
				return { reload: true };
			}

			// load code for subsequent routes immediately, if they are as
			// likely to match the current path/query as the current one
			let j = i + 1;
			while (j < info.routes.length) {
				const next = info.routes[j];
				if (next.pattern.toString() === route.pattern.toString()) {
					if (next.type === 'page') next.parts.forEach((loader) => loader());
					j += 1;
				} else {
					break;
				}
			}

			const nodes = route.parts.map((loader) => loader());
			const page = {
				host: this.host,
				path: info.path,
				params: route.params(route.pattern.exec(info.path)),
				query: info.query
			};

			const hydrated = await this._hydrate({ nodes, page });
			if (hydrated) return hydrated;
		}

		return {
			state: {
				page: null,
				query: null,
				session_changed: false,
				contexts: [],
				nodes: []
			},
			props: {
				status: 404,
				error: new Error(`Not found: ${info.path}`)
			}
		};
	}

	/** @param {import('./types').NavigationCandidate} selected */
	async _hydrate({ nodes, page }) {
		/** @type {Record<string, any>} */
		const props = {
			status: 200,

			/** @type {Error} */
			error: null,

			/** @type {import('types.internal').CSRComponent[]} */
			components: []
		};

		/**
		 * @param {string} url
		 * @param {RequestInit} opts
		 */
		const fetcher = (url, opts) => {
			if (!this.started) {
				const script = document.querySelector(`script[type="svelte-data"][url="${url}"]`);
				if (script) {
					const { body, ...init } = JSON.parse(script.textContent);
					return Promise.resolve(new Response(body, init));
				}
			}

			return fetch(url, opts);
		};

		const query = page.query.toString();

		/** @type {import('./types').NavigationState} */
		const state = {
			page,
			query,
			session_changed: false,
			nodes: [],
			contexts: []
		};

		const component_promises = [this.layout, ...nodes];
		const props_promises = [];

		/** @type {Record<string, any>} */
		let context;
		let redirect;

		const changed = {
			params: Object.keys(page.params).filter((key) => {
				return !this.current.page || this.current.page.params[key] !== page.params[key];
			}),
			query: query !== this.current.query,
			session: this.current.session_changed,
			context: false
		};

		try {
			for (let i = 0; i < component_promises.length; i += 1) {
				const previous = this.current.nodes[i];
				const previous_context = this.current.contexts[i];

				const { default: component, preload, load } = await component_promises[i];
				props.components[i] = component;

				if (preload) {
					throw new Error(
						'preload has been deprecated in favour of load. Please consult the documentation: https://kit.svelte.dev/docs#load'
					);
				}

				const changed_since_last_render =
					!previous ||
					component !== previous.component ||
					changed.params.some((param) => previous.uses.params.has(param)) ||
					(changed.query && previous.uses.query) ||
					(changed.session && previous.uses.session) ||
					(changed.context && previous.uses.context);

				if (changed_since_last_render) {
					const hash = page.path + query;

					// see if we have some cached data
					const cache = this.caches.get(component);
					const cached = cache && cache.get(hash);

					/** @type {import('./types').PageNode} */
					let node;

					/** @type {import('types.internal').LoadOutput} */
					let loaded;

					if (cached && (!changed.context || !cached.node.uses.context)) {
						({ node, loaded } = cached);
					} else {
						node = {
							component,
							uses: {
								params: new Set(),
								query: false,
								session: false,
								context: false
							}
						};

						const params = {};
						for (const key in page.params) {
							Object.defineProperty(params, key, {
								get() {
									node.uses.params.add(key);
									return page.params[key];
								},
								enumerable: true
							});
						}

						const session = this.$session;

						if (load) {
							loaded = await load.call(null, {
								page: {
									host: page.host,
									path: page.path,
									params,
									get query() {
										node.uses.query = true;
										return page.query;
									}
								},
								get session() {
									node.uses.session = true;
									return session;
								},
								get context() {
									node.uses.context = true;
									return { ...context };
								},
								fetch: fetcher
							});

							if (!loaded) return;
						}
					}

					if (loaded) {
						loaded = normalize(loaded);

						if (loaded.error) {
							props.error = loaded.error;
							props.status = loaded.status || 500;
							state.nodes = [];
							return { redirect, props, state };
						}

						if (loaded.redirect) {
							// TODO return from here?
							redirect = loaded.redirect;
							break;
						}

						if (loaded.context) {
							changed.context = true;

							context = {
								...context,
								...loaded.context
							};
						}

						if (loaded.maxage) {
							if (!this.caches.has(component)) {
								this.caches.set(component, new Map());
							}

							const cache = this.caches.get(component);
							const cached = { node, loaded };

							cache.set(hash, cached);

							let ready = false;

							const timeout = setTimeout(() => {
								clear();
							}, loaded.maxage * 1000);

							const clear = () => {
								if (cache.get(hash) === cached) {
									cache.delete(hash);
								}

								unsubscribe();
								clearTimeout(timeout);
							};

							const unsubscribe = this.stores.session.subscribe(() => {
								if (ready) clear();
							});

							ready = true;
						}

						props_promises[i] = loaded.props;
					}

					state.nodes[i] = node;
					state.contexts[i] = context;
				} else {
					state.nodes[i] = previous;
					state.contexts[i] = context = previous_context;
				}
			}

			const new_props = await Promise.all(props_promises);

			new_props.forEach((p, i) => {
				if (p) {
					props[`props_${i}`] = p;
				}
			});

			if (!this.current.page || page.path !== this.current.page.path || changed.query) {
				props.page = page;
			}
		} catch (error) {
			props.error = error;
			props.status = 500;
			state.nodes = [];
		}

		return { redirect, props, state };
	}
}

// @ts-ignore

/** @param {{
 *   paths: {
 *     assets: string;
 *     base: string;
 *   },
 *   target: Node;
 *   session: any;
 *   error: Error;
 *   status: number;
 *   nodes: import('./types').NavigationCandidate["nodes"];
 *   page: import('./types').NavigationCandidate["page"];
 * }} opts */
async function start({ paths, target, session, error, status, nodes, page }) {
	const router = new Router({
		base: paths.base,
		routes
	});

	const renderer = new Renderer({
		Root,
		layout,
		target,
		session,
		host: page.host
	});

	init({ router, renderer });
	set_paths(paths);

	router.init(renderer);
	await renderer.start({ nodes, page }, status, error);

	dispatchEvent(new CustomEvent('sveltekit:start'));
}

if (import.meta.env.VITE_SVELTEKIT_SERVICE_WORKER) {
	navigator.serviceWorker.register(import.meta.env.VITE_SVELTEKIT_SERVICE_WORKER);
}

export { start };
