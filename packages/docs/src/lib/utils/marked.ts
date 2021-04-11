import marked from 'marked';
import Prism from 'prismjs';

// Hack to ensure images are not wrapped in a paragraph tag
marked.Renderer.prototype.paragraph = function (text) {
  if (text.startsWith('<img')) return text;
  return  '<p>' + text + '</p>';
}

// lazy loading images
marked.Renderer.prototype.image = function (href, title, text) {
  return `<img src="${href}" loading=lazy alt="${text}">`;
}

// Hack to add autolink heading
marked.Renderer.prototype.heading = function (text, level, raw) {
  const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id=${id}><a href="#${id}" aria-label="${raw} permalink">${text}</a></h${level}>`;
}

// Use prism.js as the highlighter for the marked library
marked.setOptions({
  highlight: function (code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

export default marked;
