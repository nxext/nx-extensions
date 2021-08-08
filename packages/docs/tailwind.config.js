const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',
      brand: 'var(--brand)',

      textcolor: 'var(--text-color)',

      background: {
        primary: 'var(--bg-background-primary)',
        secondary: 'var(--bg-background-secondary)',
        tertiary: 'var(--bg-background-tertiary)',
      },

      highlight: {
        primary: 'var(--highlight-primary)',
        secondary: 'var(--highlight-secondary)'
      },

      modeswitch: {
        primary: 'var(--modeswitch-primary)',
        secondary: 'var(--modeswitch-secondary)'
      },

      gray: colors.coolGray,
      red: colors.red,
      orange: colors.orange,
      yellow: {
        primary: 'var(--highlight-primary)',
        ...colors.yellow
      },
      green: colors.green,
      teal: colors.teal,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink
    },
  },
  variants: {
    opacity: ['responsive', 'hover'],
  },
  plugins: [require('@tailwindcss/typography')],
  purge: {
    enabled: false,
    content: [
      './**/*.tsx',
      './**/*.ts'
    ],
  },
};
