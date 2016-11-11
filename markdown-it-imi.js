"use strict";


var escapeHtml = require('./node_modules/markdown-it/lib/common/utils').escapeHtml;

module.exports = function(md, disable_img_output) {

  disable_img_output = !!(disable_img_output);


  /**
   * 文中の　{.clazz} をパース
   */
  md.inline.ruler.after('image', 'clazz', function(state, silent) {
    var head = state.pos;
    if (state.src.charAt(head) !== '{')
      return false;
    if (state.src.charAt(head + 1) !== '.')
      return false;
    var tail = state.src.indexOf('}', head);
    if (tail < head)
      return false;
    var text = state.src.substring(head + 2, tail);
    if (!text.match(/^[a-z]+$/))
      return false;
    var token = state.push("clazz", "", 0);
    token.meta = text;
    token.hidden = true;
    state.pos = tail + 1;
    return true;
  });

  /**
   * {.clazz} を paragraph に反映する
   */
  md.core.ruler.push('clazz', function(state, silent) {
    state.tokens.forEach((a, i) => {
      if (a.type !== 'paragraph_open') return;
      state.tokens[i + 1].children.filter(b => b.type === 'clazz').forEach(b => {
        a.attrPush(['class', b.meta]);
      });
    });
  });

  /**
   * 文中の　{#(fig|tbl|lst|sec):(.+)} と　[@(fig|tbl|lst|sec):(.+)] をパース
   */
  md.inline.ruler.after('image', 'crossref', function(state, silent) {

    var head = state.pos;
    var tail = -1;
    var type = null;
    if (state.src.charAt(head) === '{' && state.src.charAt(head + 1) === '#') {
      tail = state.src.indexOf('}', head);
      type = "crossref_reg";
    }
    if (state.src.charAt(head) === '[' && state.src.charAt(head + 1) === '@') {
      tail = state.src.indexOf(']', head);
      type = "crossref";
    }

    if (tail > head) {
      var text = state.src.substring(head + 2, tail);
      if (text.match(/^(fig|tbl|lst|sec):([^\n]+)$/)) {
        var token = state.push(type, "", 0);
        token.meta = text;
        token.hidden = type === 'crossref_reg';
        state.pos = tail + 1;
        return true;
      }
    }
    return false;
  });


  /**
   * header に章節番号メタを付与する
   */
  md.core.ruler.push('crossref_sec', function(state, silent) {

    state.env.crossref = state.env.crossref || {};
    var heading = null;
    state.tokens.filter(a => a.type === 'heading_open').forEach(self => {
      if (heading == null) {
        heading = [];
        return;
      }
      var level = self.markup.length;
      heading = heading = heading.concat([0, 0, 0, 0, 0, 0]).slice(0, level);
      heading[heading.length - 1]++;

      var text = "";
      state.tokens[state.tokens.indexOf(self) + 1].children.forEach(a => {
        if (a.type === 'crossref_reg')
          state.env.crossref[a.meta] = self;
        else if (a.type === 'text')
          text += a.content;
      });

      self.meta = heading.join(".") + (heading.length === 1 ? "." : "");
      self.attrPush(['id', "crossref-sec-" + heading.join("-")]);
      self.attrPush(['title', self.meta + " " + text]);
    });
  });

  /**
   * fence に例番号メタを付与する
   */
  md.core.ruler.push('crossref_lst', function(state, silent) {

    state.env.crossref = state.env.crossref || {};
    state.tokens.filter(a => a.type === 'fence').forEach((self, i) => {
      // 自身に @id と @title を付与する
      self.attrPush(['id', "crossref-lst-" + (i + 1)]);
      self.attrPush(['title', "例" + (i + 1)]);
      self.meta = "例" + (i + 1);
      if (self.info.match(/^(.*){#(lst:.+)}$/)) {
        self.info = RegExp.$1;
        self.meta += (": " + RegExp.$1);
        state.env.crossref[RegExp.$2] = self;
      } else if (self.info.length > 0) {
        self.meta += ": " + self.info;
      }
    });

  });

  /**
   * image に図番号メタを付与する
   */
  md.core.ruler.push('crossref_fig', function(state, silent) {

    state.env.crossref = state.env.crossref || {};
    var tokens = state.tokens;

    tokens.filter(a => a.children && a.children.length > 0 && a.children[0].type === 'image').forEach((self, i) => {

      // 前後の paragraph は非表示にする
      tokens[tokens.indexOf(self) - 1].hidden = true;
      tokens[tokens.indexOf(self) + 1].hidden = true;

      var image = self.children.find(a => a.type === 'image');
      image.attrPush(['id', "crossref-fig-" + (i + 1)]);
      image.attrPush(['title', "図" + (i + 1)]);
      image.meta = '図' + (i + 1) + ": " + image.content;

      self.children.filter(a => a.type === 'crossref_reg').forEach(a => {
        state.env.crossref[a.meta] = image;
      });
    });
  });

  /**
   * table に表番号メタを付与する
   */
  md.core.ruler.push('crossref_tbl', function(state, silent) {

    state.env.crossref = state.env.crossref || {};
    var tokens = state.tokens;

    tokens.filter(a => a.type === 'table_open').forEach((self, i) => {
      self.attrPush(['id', 'crossref-tbl-' + (i + 1)]);
      self.attrPush(['title', '表' + (i + 1)]);
      self.meta = '表' + (i + 1);

      for (var j = tokens.indexOf(self); j < tokens.length - 3; j++) {
        if (tokens[j].type !== 'table_close')
          continue;
        var inline = tokens[j + 2];
        if (inline.type !== "inline" || inline.content.indexOf(":") !== 0)
          return;
        inline.children.forEach((a, i) => {
          if (a.type === 'text')
            self.meta += (i === 0 ? a.content.replace(/^:/, ": ") : a.content);
          else if (a.type === 'crossref_reg')
            state.env.crossref[a.meta] = self;
        });
        tokens[j + 1].hidden = true;
        tokens[j + 2].hidden = true;
        tokens[j + 2].children = [];
        tokens[j + 3].hidden = true;
        return;
      }
    });
  });


  /**
   *  [@(fig|tbl|lst|sec):(.+)] をレンダリング
   */
  md.renderer.rules.crossref = function(tokens, index, options, env, self) {
    var token = env.crossref[tokens[index].meta];
    if (token && token.attrGet)
      return '<a href="#' + token.attrGet('id') + '">' + escapeHtml(token.attrGet('title')) + '</a>';
    return "<b>not found : " + escapeHtml(tokens[index].meta) + "</b>";
  };

  /**
   * ヘッダーに caption(+連番) を付与してレンダリング
   */
  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    var html = md.renderer.renderToken(tokens, idx, options);
    if (tokens[idx].meta)
      html += '<span>' + escapeHtml(tokens[idx].meta) + '</span>\n';
    return html;
  };

  /**
   * 初出のヘッダーの直後に目次を挿入
   */
  md.renderer.rules.heading_close = function(tokens, idx, options, env, self) {
    var html = md.renderer.renderToken(tokens, idx, options);
    for (var i = 0; i < idx; i++)
      if (tokens[i].type === "heading_close")
        return html;
    html += "\n";
    html += "<ul class='toc'>";

    tokens.filter((a, i) => i > idx && a.type === 'heading_open').forEach(token => {
      html += "<li class='level" + token.markup.length + "'>";
      html += "<a href='#" + token.attrGet('id') + "'>";
      html += escapeHtml(token.attrGet('title'));
      html += "</a></li>\n";
    });
    html += "</ul>";
    return html;
  };


  /**
   * テーブルに caption(+連番) を付与してレンダリング
   */
  md.renderer.rules.table_open = function(tokens, idx, options, env, self) {
    return md.renderer.renderToken(tokens, idx, options) +
      '<caption>' + escapeHtml(tokens[idx].meta) + '</caption>';
  };

  /**
   * image に caption(+連番) を付与してレンダリング
   */
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    var token = tokens[idx];
    var html = '<figure class="fig" id="' + token.attrGet('id') + '" ';
    html += 'title="' + escapeHtml(token.attrGet('title')) + '">\n';

    if (disable_img_output)
      html += '<div>' + token.attrGet('src') + '</div>';
    else
      html += '<img src="' + token.attrGet('src') + '"/>';
    html += '<figcaption>' + escapeHtml(token.meta) + '</figcaption>';
    html += '</figure>';
    return html;
  };

  /**
   * fance に caption(+連番) を付与してレンダリング
   */
  md.renderer.rules.fence = function(tokens, idx, options, env, self) {
    var token = tokens[idx];
    var html = '<figure class="lst" id="' + token.attrGet('id') + '" ';
    html += 'title="' + escapeHtml(token.attrGet('title')) + '">\n';
    html += '<figcaption>' + escapeHtml(token.meta) + '</figcaption>';
    html += '<pre><code>';
    html += escapeHtml(token.content);
    html += '</code></pre>';
    html += '</figure>';
    return html;
  };

};
