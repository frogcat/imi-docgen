"use strict";

var fs = require('fs');
var md = require('markdown-it')();
md.use(require('./markdown-it-imi'));

var html = fs.readFileSync(process.argv[2], "UTF-8");
var src = fs.readFileSync(process.argv[3], "UTF-8");

var env = {};
var dst = md.render(src, env);

var title = env.title;
html = html.replace("${title}", title);
html = html.replace("${dst}", dst);

console.log(html);
