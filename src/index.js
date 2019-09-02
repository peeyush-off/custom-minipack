const fs = require('fs');
const bundle = require('./bundle.js');

const obj = JSON.parse(fs.readFileSync('src/config.json', 'utf8'));

bundle(obj.entry, obj.dist);