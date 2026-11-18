(() => {
  if (window.__reviewComments) return;
  window.__reviewComments = true;

  const KEY = 'review-comments:' + location.pathname;
  const BLOCKS = 'p, li, ul, ol, table, img, pre, blockquote, h1, h2, h3, h4, h5, h6, details';
  const SKIP = 'a, summary, button, input, textarea, select, label, [data-rc-ui]';
  const KINDS = {
    P: 'paragraph', BLOCKQUOTE: 'paragraph', LI: 'list', UL: 'list', OL: 'list',
    TABLE: 'table', IMG: 'image', PRE: 'code', DETAILS: 'details',
  };

  const css = `
[data-rc-hover]{outline:1px dashed var(--rc-accent)!important;outline-offset:2px;cursor:pointer}
[data-rc-marked]{outline:2px solid var(--rc-accent)!important;outline-offset:2px;background:color-mix(in srgb,var(--rc-accent) 12%,transparent)!important}
[data-rc-marked][data-rc-hover]{background:color-mix(in srgb,var(--rc-accent) 24%,transparent)!important}
.rc-box,.rc-bar{all:initial;position:absolute;z-index:2147483647;box-sizing:border-box;font:13px/1.4 var(--rc-font);color:var(--rc-fg);background:var(--rc-bg);border:1px solid var(--rc-line);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.25);padding:8px}
.rc-bar{position:fixed;right:16px;bottom:16px;display:flex;gap:6px}
.rc-box textarea{all:initial;display:block;box-sizing:border-box;width:100%;min-height:72px;padding:6px;font:13px/1.4 var(--rc-font);color:var(--rc-fg);background:var(--rc-bg);border:1px solid var(--rc-line);border-radius:4px;resize:vertical;white-space:pre-wrap}
.rc-box textarea:focus{border-color:var(--rc-accent)}
.rc-quote{all:initial;display:block;margin:0 0 6px;padding-left:8px;border-left:2px solid var(--rc-accent);font:12px/1.4 var(--rc-font);color:color-mix(in srgb,var(--rc-fg) 65%,var(--rc-bg));max-height:4.2em;overflow:hidden;overflow-wrap:anywhere}
.rc-row{display:flex;gap:6px;justify-content:flex-end;margin-top:6px}
.rc-box button,.rc-bar button{all:initial;cursor:pointer;font:13px/1 var(--rc-font);color:var(--rc-fg);background:var(--rc-soft);border:1px solid var(--rc-line);border-radius:4px;padding:6px 10px}
.rc-box button.rc-primary,.rc-bar button.rc-primary{background:var(--rc-accent);color:var(--rc-bg);border-color:var(--rc-accent)}
.rc-bar button:disabled{opacity:.45;cursor:default}`;

  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const visible = (el) => clean(el ? el.innerText ?? el.textContent : '');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = () => {
    try { comments.length ? localStorage.setItem(KEY, JSON.stringify(comments)) : localStorage.removeItem(KEY); } catch {}
  };

  const blocks = () => [...document.body.querySelectorAll(BLOCKS)].filter((el) => !el.closest('[data-rc-ui]'));
  const kindOf = (el) => KINDS[el.tagName] || (/^H\d$/.test(el.tagName) ? 'heading' : 'paragraph');

  const textOf = (el) => {
    if (el.tagName === 'IMG') return clean(el.alt) || (el.getAttribute('src') || '').split('/').pop();
    const text = visible(el);
    const summary = el.tagName === 'DETAILS' && visible(el.querySelector(':scope > summary'));
    return summary && text.startsWith(summary) ? text.slice(summary.length).trim() : text;
  };
  const targetOf = (el) => {
    const t = textOf(el);
    return t.length > 80 ? t.slice(0, 80).trimEnd() + '…' : t;
  };
  const previewOf = (el) => {
    if (el.tagName === 'IMG') {
      const src = el.getAttribute('src') || '';
      const path = src.startsWith('data:') ? '' : src.length > 60 ? '…' + src.slice(-59) : src;
      return `[image: ${path || clean(el.alt) || 'inline'}]`;
    }
    const t = targetOf(el);
    return t ? `[${t}]` : '[…]';
  };

  const sectionOf = (el) => {
    const trail = [];
    for (const h of document.body.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      if (h === el || !(h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      if (h.contains(el)) continue;
      const level = +h.tagName[1];
      while (trail.length && trail[trail.length - 1].level >= level) trail.pop();
      trail.push({ level, text: visible(h) });
    }
    const parts = trail.map((t) => t.text);
    const summary = el.closest('details')?.querySelector(':scope > summary');
    if (summary) parts.push(visible(summary));
    return parts.join(' › ');
  };

  const find = (c) => {
    const all = blocks();
    const at = all[c.index];
    if (at && at.tagName === c.tag && targetOf(at) === c.target) return at;
    return all.find((el) => el.tagName === c.tag && targetOf(el) === c.target) || null;
  };

  let comments = load();
  let box = null;

  const ui = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.setAttribute('data-rc-ui', '');
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };

  // Take the page's own font and colors so the comment UI matches whatever design system the page uses.
  const theme = () => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const clear = (c) => !c || c === 'transparent' || /^rgba\(.*,\s*0\)$/.test(c);
    const bg = [body.backgroundColor, root.backgroundColor].find((c) => !clear(c)) || '#fff';
    const link = document.querySelector('a[href]');
    const accent = root.getPropertyValue('--review-accent').trim() || (link && getComputedStyle(link).color) || '#f5b400';
    return `:root{--rc-bg:${bg};--rc-fg:${body.color};--rc-font:${body.fontFamily};--rc-accent:${accent};`
      + '--rc-line:color-mix(in srgb,var(--rc-fg) 22%,var(--rc-bg));--rc-soft:color-mix(in srgb,var(--rc-fg) 8%,var(--rc-bg))}';
  };

  const style = ui('style');
  style.textContent = theme() + css;
  document.head.appendChild(style);

  const bar = ui('div', 'rc-bar');
  const copyBtn = ui('button', 'rc-primary');
  const clearBtn = ui('button', '', 'Clear');
  bar.append(copyBtn, clearBtn);
  document.body.appendChild(bar);

  const render = () => {
    document.querySelectorAll('[data-rc-marked]').forEach((el) => el.removeAttribute('data-rc-marked'));
    for (const c of comments) find(c)?.setAttribute('data-rc-marked', '');
    const n = comments.length;
    copyBtn.textContent = `Copy ${n} comment${n === 1 ? '' : 's'}`;
    copyBtn.disabled = clearBtn.disabled = n === 0;
  };

  const closeBox = () => { box?.remove(); box = null; };

  const openBox = (el) => {
    closeBox();
    const all = blocks();
    const existing = comments.find((c) => find(c) === el);
    box = ui('div', 'rc-box');
    const area = ui('textarea');
    area.placeholder = 'Comment on this block';
    area.value = existing ? existing.body : '';
    const row = ui('div', 'rc-row');
    const cancel = ui('button', '', 'Cancel');
    const del = ui('button', '', 'Delete');
    const ok = ui('button', 'rc-primary', 'Save');
    row.append(...(existing ? [del] : []), cancel, ok);
    box.append(ui('div', 'rc-quote', previewOf(el)), area, row);

    const r = el.getBoundingClientRect();
    const width = Math.min(360, document.documentElement.clientWidth - 16);
    box.style.width = width + 'px';
    box.style.top = r.bottom + scrollY + 6 + 'px';
    box.style.left = Math.max(8, Math.min(r.left, document.documentElement.clientWidth - width - 8)) + scrollX + 'px';
    document.body.appendChild(box);
    area.focus();

    const commit = () => {
      const body = area.value.trim();
      comments = comments.filter((c) => c !== existing);
      if (body) {
        comments.push({
          index: all.indexOf(el), tag: el.tagName, target: targetOf(el),
          section: sectionOf(el), kind: kindOf(el), body,
        });
        comments.sort((a, b) => a.index - b.index);
      }
      save(); render(); closeBox();
    };
    ok.onclick = commit;
    cancel.onclick = closeBox;
    del.onclick = () => { area.value = ''; commit(); };
    area.onkeydown = (e) => {
      if (e.key === 'Escape') closeBox();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
    };
  };

  const toXml = () => [
    `<page-review page="${esc(location.href.split('#')[0])}">`,
    ...comments.map((c) => {
      const el = find(c);
      const section = el ? sectionOf(el) : c.section;
      return [
        `  <comment section="${esc(section)}" kind="${esc(c.kind)}">`,
        `    <target>${esc(c.target)}</target>`,
        `    <body>${esc(c.body)}</body>`,
        `  </comment>`,
      ].join('\n');
    }),
    `</page-review>`,
  ].join('\n');

  const writeClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); return; } catch {}
    const t = ui('textarea');
    t.value = text;
    t.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    t.remove();
  };

  copyBtn.onclick = async () => {
    await writeClipboard(toXml());
    copyBtn.textContent = 'Copied';
    setTimeout(render, 1200);
  };

  clearBtn.onclick = () => {
    comments = [];
    save(); closeBox(); render();
  };

  const blockAt = (t) => {
    if (!(t instanceof Element) || t.closest(SKIP)) return undefined;
    const el = t.closest(BLOCKS);
    return el && document.body.contains(el) ? el : null;
  };

  document.addEventListener('click', (e) => {
    const el = blockAt(e.target);
    if (el === undefined || String(getSelection() || '')) return;
    if (el) openBox(el);
    else closeBox();
  });

  let hovered = null;
  const hover = (el) => {
    if (el === hovered) return;
    hovered?.removeAttribute('data-rc-hover');
    hovered = el;
    el?.setAttribute('data-rc-hover', '');
  };
  document.addEventListener('mouseover', (e) => hover(blockAt(e.target) || null));
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) hover(null); });

  render();
})();
