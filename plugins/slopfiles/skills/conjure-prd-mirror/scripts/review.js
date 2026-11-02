// Offline review layer for the PRD site: click a block to comment, copy all comments as XML.
(() => {
  const KEY = 'prd-review:' + location.pathname;
  const NAME_KEY = 'prd-review:name';
  const SEL = '.wrap h2, .wrap h3, .wrap p, .wrap li, .wrap table, .wrap pre, .wrap blockquote, .wrap .shot img';
  const css = `
.rv-hover { outline: 1px dashed #ff5a00; outline-offset: 4px; border-radius: 4px; cursor: pointer; }
.rv-has { box-shadow: -10px 0 0 -8px #ff5a00; }
img.rv-has { box-shadow: 0 0 0 2px #ff5a00, 0 20px 50px rgba(0,0,0,.5); }
.rv-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; margin-left: 8px; border-radius: 9px; background: #ff5a00; color: #000; font: 600 11px 'Geist Mono', monospace; vertical-align: middle; cursor: pointer; }
.rv-badge.abs { position: absolute; top: 8px; right: 8px; z-index: 5; margin: 0; }
.rv-pop { position: absolute; z-index: 100; width: 340px; background: #0c0b0a; border: 1px solid #2e2926; border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,.6); padding: 12px; display: flex; flex-direction: column; gap: 8px; font-family: 'Geist', system-ui, sans-serif; }
.rv-pop .tgt { font: 11px 'Geist Mono', monospace; color: #80756f; max-height: 48px; overflow: hidden; border-left: 2px solid #ff5a00; padding-left: 8px; }
.rv-pop .c { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: #b5ada7; line-height: 1.45; }
.rv-pop .c b { color: #fdfcfb; font-weight: 500; }
.rv-pop .c .x { margin-left: auto; color: #80756f; cursor: pointer; background: none; border: 0; font-size: 12px; }
.rv-pop .c .x:hover { color: #ffa675; }
.rv-pop textarea, .rv-pop input { width: 100%; box-sizing: border-box; background: #060505; color: #fdfcfb; border: 1px solid #2e2926; border-radius: 6px; padding: 8px; font: 13.5px 'Geist', system-ui, sans-serif; resize: vertical; }
.rv-pop textarea:focus, .rv-pop input:focus { outline: none; border-color: #ff5a00; }
.rv-pop .row { display: flex; align-items: center; gap: 8px; }
.rv-pop .row .sp { flex: 1; }
.rv-pop .hint { font: 11px 'Geist Mono', monospace; color: #80756f; }
.rv-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #2e2926; background: #151311; color: #fdfcfb; font: 500 13px 'Geist', system-ui, sans-serif; cursor: pointer; }
.rv-btn.p { background: #ff5a00; border-color: #ff5a00; color: #000; }
.rv-btn:disabled { opacity: .45; cursor: default; }
.rv-bar { display: inline-flex; align-items: center; gap: 8px; }
.rv-bar .clear { background: none; border: 0; color: #80756f; font-size: 12px; cursor: pointer; }
.rv-bar .clear:hover { color: #ffa675; }
.rv-tip { font: 11px 'Geist Mono', monospace; color: #80756f; }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));
  let comments = load();
  let nodes = [];
  let pop = null;

  const kindOf = (el) => {
    if (el.tagName === 'IMG') return 'image';
    if (el.tagName === 'PRE') return el.classList.contains('mermaid') ? 'diagram' : 'code';
    return { H2: 'heading', H3: 'heading', P: 'paragraph', LI: 'list-item', TABLE: 'table', BLOCKQUOTE: 'quote' }[el.tagName] || 'block';
  };
  const snippet = (el) => {
    if (el.tagName === 'IMG') return el.getAttribute('alt') || '';
    const t = (el.tagName === 'PRE' && el.querySelector('svg') ? [...el.querySelectorAll('svg .nodeLabel, svg text')].map((n) => n.textContent.trim()).filter(Boolean).join(' · ') : el.textContent).replace(/\s+/g, ' ').trim();
    return t.length > 160 ? t.slice(0, 157) + '…' : t;
  };
  const sectionOf = (el) => {
    let h2 = '', h3 = '';
    for (const h of document.querySelectorAll('.wrap h1, .wrap h2, .wrap h3')) {
      if (h === el || h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
        if (h.tagName === 'H3') h3 = h.textContent.trim(); else { h2 = h.textContent.trim(); h3 = ''; }
      }
    }
    return [h2, h3].filter(Boolean).join(' › ');
  };
  const nodeFor = (target) => {
    const el = target.closest(SEL);
    return el && nodes.includes(el) ? el : null;
  };

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const toXml = () => {
    const name = localStorage.getItem(NAME_KEY) || '';
    const lines = [`<prd-review page="${esc(location.href.split('#')[0])}"${name ? ` reviewer="${esc(name)}"` : ''} copied="${new Date().toISOString()}">`];
    const ordered = [...comments].sort((a, b) => a.idx - b.idx || a.at - b.at);
    for (const c of ordered) {
      lines.push(`  <comment section="${esc(c.section)}" kind="${c.kind}"${c.src ? ` src="${esc(c.src)}"` : ''}>`);
      lines.push(`    <target>${esc(c.snippet)}</target>`);
      lines.push(`    <body>${esc(c.text)}</body>`);
      lines.push('  </comment>');
    }
    lines.push('</prd-review>');
    return lines.join('\n');
  };

  let copyBtn, clearBtn;
  const refresh = () => {
    document.querySelectorAll('.rv-badge').forEach((b) => b.remove());
    nodes.forEach((el) => el.classList.remove('rv-has'));
    const counts = new Map();
    for (const c of comments) counts.set(c.idx, (counts.get(c.idx) || 0) + 1);
    counts.forEach((n, idx) => {
      const el = nodes[idx];
      if (!el) return;
      el.classList.add('rv-has');
      const b = document.createElement('span');
      b.className = 'rv-badge';
      b.textContent = n;
      b.title = n + ' comment' + (n > 1 ? 's' : '');
      if (el.tagName === 'IMG' || el.tagName === 'PRE' || el.tagName === 'TABLE') {
        // Never append inside a mermaid <pre>: mermaid parses its text, so a badge there breaks the diagram.
        const host = el.tagName === 'IMG' ? el.closest('.shot') || el.parentElement : wrap(el);
        host.style.position = host.style.position || 'relative';
        b.classList.add('abs');
        host.appendChild(b);
        b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); open(el); });
      } else {
        el.appendChild(b);
      }
    });
    const n = comments.length;
    copyBtn.textContent = `Copy ${n} comment${n === 1 ? '' : 's'}`;
    copyBtn.disabled = n === 0;
    clearBtn.style.display = n ? '' : 'none';
  };

  const wrap = (el) => {
    if (el.parentElement.classList.contains('rv-wrap')) return el.parentElement;
    const w = document.createElement('div');
    w.className = 'rv-wrap';
    el.parentElement.insertBefore(w, el);
    w.appendChild(el);
    return w;
  };
  const close = () => { if (pop) { pop.remove(); pop = null; } };
  const open = (el) => {
    close();
    const idx = nodes.indexOf(el);
    const mine = comments.filter((c) => c.idx === idx);
    const needName = !localStorage.getItem(NAME_KEY);
    pop = document.createElement('div');
    pop.className = 'rv-pop';
    pop.innerHTML = `<div class="tgt"></div>${mine.map((c) => `<div class="c" data-at="${c.at}"><div><b>${esc(c.name || 'You')}</b> ${esc(c.text)}</div><button class="x" title="Delete">Delete</button></div>`).join('')}
${needName ? '<input class="nm" placeholder="Your name (saved for next time)">' : ''}<textarea rows="3" placeholder="Add a comment…"></textarea>
<div class="row"><span class="hint">⌘/Ctrl+Enter to save · Esc to close</span><span class="sp"></span><button class="rv-btn cancel">Cancel</button><button class="rv-btn p save">Comment</button></div>`;
    pop.querySelector('.tgt').textContent = `${kindOf(el)} · ${snippet(el)}`;
    document.body.appendChild(pop);
    const r = el.getBoundingClientRect();
    const left = Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - 356);
    pop.style.left = Math.max(8, left) + 'px';
    pop.style.top = window.scrollY + (el.tagName === 'IMG' ? r.top + 40 : r.bottom + 8) + 'px';
    const ta = pop.querySelector('textarea');
    ta.focus();
    const commit = () => {
      const text = ta.value.trim();
      if (!text) return;
      const nm = pop.querySelector('.nm');
      if (nm && nm.value.trim()) localStorage.setItem(NAME_KEY, nm.value.trim());
      comments.push({ idx, at: Date.now(), kind: kindOf(el), section: sectionOf(el), snippet: snippet(el), src: el.tagName === 'IMG' ? el.getAttribute('src') : undefined, text, name: localStorage.getItem(NAME_KEY) || '' });
      save(comments); refresh(); close();
    };
    pop.querySelector('.save').addEventListener('click', commit);
    pop.querySelector('.cancel').addEventListener('click', close);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit(); if (e.key === 'Escape') close(); });
    pop.querySelectorAll('.c .x').forEach((x) => x.addEventListener('click', () => {
      const at = Number(x.closest('.c').dataset.at);
      comments = comments.filter((c) => c.at !== at);
      save(comments); refresh(); open(el);
    }));
    pop.addEventListener('click', (e) => e.stopPropagation());
  };

  const init = () => {
    nodes = [...document.querySelectorAll(SEL)].filter((el) => !el.closest('.top, footer, .rv-pop'));
    const bar = document.createElement('span');
    bar.className = 'rv-bar';
    bar.innerHTML = '<span class="rv-tip">Click any block to comment</span><button class="rv-btn p copy"></button><button class="clear" title="Delete all comments on this page">Clear</button>';
    copyBtn = bar.querySelector('.copy');
    clearBtn = bar.querySelector('.clear');
    const top = document.querySelector('.top');
    top.insertBefore(bar, top.querySelector('.cta'));
    copyBtn.addEventListener('click', async () => {
      const xml = toXml();
      try { await navigator.clipboard.writeText(xml); } catch {
        const t = document.createElement('textarea'); t.value = xml; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
      }
      const label = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = label; }, 1400);
    });
    clearBtn.addEventListener('click', () => {
      if (!confirm(`Delete all ${comments.length} comments on this page?`)) return;
      comments = []; save(comments); refresh();
    });
    let hovered = null;
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.rv-pop, .rv-badge')) return;
      const el = nodeFor(e.target);
      if (el === hovered) return;
      if (hovered) hovered.classList.remove('rv-hover');
      hovered = el;
      if (el) el.classList.add('rv-hover');
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('.rv-pop')) return;
      const el = nodeFor(e.target);
      const link = e.target.closest('a');
      if (link && !link.querySelector('img') && el && el.tagName !== 'IMG') { return; }
      if (!el) { close(); return; }
      e.preventDefault();
      open(el);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    refresh();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
