import { exec } from 'child_process';

const pkgs = [
  '@stencil/core',
  '@stencil/sass',
  '@stencil/less',
  '@stencil/postcss',
  '@stencil/stylus',

  '@stencil/react-output-target',
  '@stencil/vue-output-target',
  '@stencil/angular-output-target',
  '@stencil/svelte-output-target',
];

pkgs.forEach((pkg) => {
  exec(`npm show ${pkg} version`, (error, stdout, sterr) => {
    if (error) {
      console.log(`Error fetching ${pkg}`);
      return;
    }
    console.log(`${pkg} = ${stdout}`);
  });
});
