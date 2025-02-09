const appendChildren = (node, children) => {
   for (const child of children) {
      if (typeof child === 'string') {
         node.append(document.createTextNode(child))
      } else if (typeof child === 'function') {
         const maybeChild = child(node);
         if (maybeChild) {
            node.append(maybeChild);
         }
      } else if (child) {
         node.append(child);
      }
   }
};

const toKebab = (name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

function _(name, ...children) {
   const result = document.createElement(name);
   appendChildren(result, children);

   result._att = function (atts) {
      for (const [name, value] of Object.entries(atts))
         this.setAttribute(toKebab(name), value)
      return this;
   };

   result._onclick = function (callback) {
      this.onclick = callback;
      return this;
   };

   result._onsubmit = function (callback) {
      this.onsubmit = callback;
      return this;
   };

   return result;
}

for (let tagName of ['abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'])
   window['_' + tagName] = (...children) => _(tagName, ...children);

const _a = (name, href) => _('a', name)._att({ href });
const _img = (src) => _('img')._att({ src })
const _input = (type) => _('input')._att({ type });

// TODO: nested routers
const _router = (routes, node = _div) => {
   let result = node();

   const syncHash = () => {
      let hashLocation = document.location.hash.split('#')[1];
      if (!hashLocation)
         hashLocation = '/'

      if (!(hashLocation in routes)) {
         const route404 = '/404';
         console.assert(route404 in routes);
         hashLocation = route404;
      }

      const child = routes[hashLocation](result);
      if (Array.isArray(child)) {
         result.innerHTML = '';
         appendChildren(result, child);
      } else {
         result.replaceChildren(child);
      }

      return result;
   };

   syncHash();

   window.addEventListener("hashchange", syncHash);

   result.refresh = syncHash;

   return result;
};
