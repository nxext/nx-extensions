import { ssr } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import * as setup from "./setup.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"icon\" href=\"/favicon.ico\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    " + head + "\n  </head>\n  <body>\n    <div id=\"svelte\">" + body + "</div>\n  </body>\n</html>\n";

set_paths({"base":"","assets":"/."});

// allow paths to be overridden in svelte-kit start
export function init({ paths }) {
	set_paths(paths);
}

const d = decodeURIComponent;
const empty = () => ({});

const components = [
	() => import("../../src/routes/index.svelte")
];



const client_component_lookup = {".svelte/build/runtime/internal/start.js":"start-8f24884a.js","src/routes/index.svelte":"pages/index.svelte-500b7d20.js"};

const manifest = {
	assets: [{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: () => import("./components/layout.svelte"),
	error: () => import("./components/error.svelte"),
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						parts: [{ id: "src/routes/index.svelte", load: components[0] }],
						css: ["assets/start-a8cd1609.css", "assets/pages/index.svelte-ec482201.css"],
						js: ["start-8f24884a.js", "chunks/index-2b3ab8a5.js", "pages/index.svelte-500b7d20.js"]
					}
	]
};

export function render(request, {
	paths = {"base":"","assets":"/."},
	local = false,
	only_render_prerenderable_pages = false,
	get_static_file
} = {}) {
	return ssr(request, {
		paths,
		local,
		template,
		manifest,
		target: "#svelte",
		entry: "/./_app/start-8f24884a.js",
		root,
		setup,
		dev: false,
		amp: false,
		only_render_prerenderable_pages,
		app_dir: "_app",
		host: null,
		host_header: null,
		get_component_path: id => "/./_app/" + client_component_lookup[id],
		get_stack: error => error.stack,
		get_static_file,
		get_amp_css: dep => amp_css_lookup[dep]
	});
}