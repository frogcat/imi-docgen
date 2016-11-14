"use strict";

var fs = require('fs');
var md = require('markdown-it')();
md.use(require('./markdown-it-imi'));

var src = fs.readFileSync(process.argv[2], "UTF-8");
var env = {};
var dst = md.render(src, env);

var title = env.title;

console.log(`<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="print.css" media="print"/>
</head>

<body>
<div id="container">
  <header>
    <img src="http://imi.go.jp/prep/IMITopNew.png"/>
    <img src="http://imi.go.jp/prep/goila.png"/>
  </header>
  <article>
  ${dst}
  </article>
  <footer>
    <a href="http://www.meti.go.jp/">経済産業省（法人番号 4000012090001）</a>,
    <a href="http://www.ipa.go.jp/">独立行政法人 情報処理推進機構（法人番号 5010005007126）</a>
  </footer>
</div>
</body>
</html>
`);
