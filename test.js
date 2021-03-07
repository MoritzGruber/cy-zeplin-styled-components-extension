const mani = require('./dist/manifest.json')
const main = require('./dist/' + mani.moduleURL)
const sample = require('./sample.json')

const res = main.textStyles(sample);

console.log(` res`, res);
