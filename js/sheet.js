// Shared: whitelist sanitizer for the Word-like crop pages (used by admin preview and the farmer view)
window.AgriSheet = {
  clean(html) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const OK = new Set(['H2', 'H3', 'P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'SPAN', 'DIV', 'IMG', 'FONT']);
    const CSS = /^\s*(color|background-color|text-align|width|font-size)\s*:\s*[#\w\s%.,()-]+$/i;
    (function walk(n) {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) return;
        if (c.nodeType !== 1) { c.remove(); return; }
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META'].includes(c.tagName)) { c.remove(); return; }
        walk(c);
        if (!OK.has(c.tagName)) { c.replaceWith(...c.childNodes); return; }
        if (c.tagName === 'IMG' && !/^data:image\/(jpeg|png|webp|gif);/.test(c.getAttribute('src') || '')) { c.remove(); return; }
        [...c.attributes].forEach((a) => {
          if (a.name === 'style') c.setAttribute('style', c.style.cssText.split(';').filter((r) => CSS.test(r)).join(';'));
          else if (!((a.name === 'src' && c.tagName === 'IMG') || a.name === 'alt' || (a.name === 'color' && c.tagName === 'FONT'))) c.removeAttribute(a.name);
        });
      });
    })(doc.body);
    return doc.body.innerHTML;
  }
};
