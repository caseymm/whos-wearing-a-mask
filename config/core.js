// packages
const { Baker } = require('@datagraphics/baker');

const entrypoints = [
  // Add more script entrypoints here as needed
  'app',
  'submit',
];

const baker = new Baker({
  assets: 'assets',
  data: '_data',
  domain: 'https://caseymm.github.io/whos-wearing-a-mask/_dist',
  entrypoints: `scripts/${
    entrypoints.length > 1 ? `{${entrypoints.join(',')}}` : entrypoints[0]
  }.js`,
  input: process.cwd(),
  layouts: '_layouts',
  output: '_dist',
  pathPrefix: 'whos-wearing-a-mask/' || '/',
  staticRoot: 'whos-wearing-a-mask/' || '/',
});

module.exports = { baker };
