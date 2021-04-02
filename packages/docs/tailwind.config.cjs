const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
	purge: {
		content: [
			"./src/**/*.{html,js,svelte,ts}",
		],
		options: {
			defaultExtractor: (content) => [
				// If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
				...tailwindExtractor(content),
				// Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
				...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
			],
			keyframes: true,
		},
	},
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
