// Builds a static mirror of a Markdown PRD for Conjure, with an offline click-to-comment layer (review.js).
// Usage: node site.mjs <prd.md> <out-dir> [--label TEXT] [--intro TEXT] [--questions DIR] [--pdf FILE] [--source TEXT]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const label = flag('label') ?? 'PRD';
const intro = flag('intro') ?? '';
const qdirArg = flag('questions');
const pdfArg = flag('pdf');
const sourceArg = flag('source');
const [mdPath, outArg] = args;
if (!mdPath || !outArg) { console.error('Usage: node site.mjs <prd.md> <out-dir> [--label TEXT] [--intro TEXT] [--questions DIR] [--pdf FILE] [--source TEXT]'); process.exit(2); }

// marked, mermaid and the Geist fonts live in a per-user cache so the skill has no install step.
const DEPS = path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), 'conjure-prd-mirror');
if (!fs.existsSync(path.join(DEPS, 'node_modules', 'mermaid'))) {
  fs.mkdirSync(DEPS, { recursive: true });
  execFileSync('npm', ['i', '--prefix', DEPS, '--no-audit', '--no-fund', '--silent', 'marked@16', 'mermaid@11', 'geist'], { stdio: 'inherit' });
}
const require = createRequire(path.join(DEPS, 'node_modules', '/'));
const { marked } = require('marked');
const nm = path.join(DEPS, 'node_modules');

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.dirname(path.resolve(mdPath));
const S = path.resolve(outArg);
fs.rmSync(S, { recursive: true, force: true });
fs.mkdirSync(path.join(S, 'fonts'), { recursive: true });
const fontFiles = [['geist-sans', 'Geist-Variable.woff2', 'Geist'], ['geist-mono', 'GeistMono-Variable.woff2', 'Geist Mono']];
for (const [dir, f] of fontFiles) fs.copyFileSync(path.join(nm, 'geist', 'dist', 'fonts', dir, f), path.join(S, 'fonts', f));
fs.writeFileSync(path.join(S, 'fonts.css'), fontFiles.map(([, f, fam]) => `@font-face { font-family: '${fam}'; src: url('fonts/${f}') format('woff2'); font-weight: 100 900; font-display: swap; }`).join('\n'));
fs.copyFileSync(path.join(nm, 'mermaid', 'dist', 'mermaid.min.js'), path.join(S, 'mermaid.min.js'));
fs.copyFileSync(path.join(HERE, 'review.js'), path.join(S, 'review.js'));

// Copies every relative image or PDF the Markdown links to, keeping its relative path.
// Question pages fall back to the PRD's folder, where their images usually live.
const copyAssets = (text, base) => {
  for (const [, ref] of text.matchAll(/(?:!\[[^\]]*\]|\[[^\]]*\])\(([^)\s]+)[^)]*\)|<img[^>]+src="([^"]+)"/g)) {
    if (!ref || /^(https?:|#|mailto:)/.test(ref) || !/\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(ref)) continue;
    const from = [base, SRC].map((b) => path.join(b, ref)).find((p) => fs.existsSync(p));
    if (!from) { console.warn(`missing asset: ${ref}`); continue; }
    fs.mkdirSync(path.dirname(path.join(S, ref)), { recursive: true });
    fs.copyFileSync(from, path.join(S, ref));
  }
};

let md = fs.readFileSync(mdPath, 'utf8').replace(/^---[\s\S]*?---\n/, '');
copyAssets(md, SRC);
let pdfName = '';
if (pdfArg) { pdfName = path.basename(pdfArg); fs.copyFileSync(pdfArg, path.join(S, pdfName)); }

const renderer = new marked.Renderer();
const baseCode = renderer.code.bind(renderer);
renderer.code = (tok) => tok.lang === 'mermaid' ? `<pre class="mermaid">${tok.text}</pre>` : baseCode(tok);
const title = (md.match(/^# (.*)$/m) || [, 'PRD'])[1].replace(/^PRD:\s*/, '');
md = md.replace(/^# .*\n/m, '');
const sections = [...md.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let n = 0;
renderer.heading = (tok) => {
  const text = marked.parseInline(tok.text);
  if (tok.depth === 2) { n += 1; return `</section><section class="card" id="${slug(tok.text)}"><div class="ch"><span class="no">${String(n).padStart(2, '0')}</span><h2>${text}</h2></div>`; }
  return `<h${tok.depth} id="${slug(tok.text)}">${text}</h${tok.depth}>`;
};
// Pairs an image with the numbered list right after it: image on the left, notes on the right.
// A "See the options…" link right after the list moves under the image as a button.
const pairFigures = (html) => html.replace(/<p>(<img [^>]*>)<\/p>\s*<ol>([\s\S]*?)<\/ol>(?:\s*<p><a href="([^"]+)">(See the options[^<]*)<\/a><\/p>)?/g, (_, img, items, href, text) => `<figure class="anno"><div class="shot">${img}${href ? `<a class="opts" href="${href.replace(/^https?:\/\/[^/]+\//, '')}">${text}</a>` : ''}</div><ol class="notes">${items.replace(/<li>/g, '<li><span>').replace(/<\/li>/g, '</span></li>')}</ol></figure>`);
const linkImages = (html) => html.replace(/(<img src="([^"]+)"[^>]*>)/g, '<a href="$2">$1</a>');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const body = pairFigures(marked.parse(md, { renderer }).replace(/^<\/section>/, ''));
const mark = fs.readFileSync(path.join(HERE, 'factory-mark.svg'), 'utf8');
const built = new Date().toISOString().slice(0, 16).replace('T', ' ');
const style = `<style>
:root { --o: #ff5a00; --oT: #ffa675; --bg: #060505; --s1: #0c0b0a; --s2: #151311; --ln: #1d1a18; --ln2: #2e2926; --t1: #fdfcfb; --t2: #b5ada7; --t3: #80756f; --mono: 'Geist Mono', ui-monospace, monospace; }
html, body { margin: 0; background: var(--bg); color: var(--t1); font-family: 'Geist', system-ui, sans-serif; letter-spacing: -0.01em; -webkit-font-smoothing: antialiased; }
a { color: var(--oT); text-decoration: none; } a:hover { text-decoration: underline; }
.top { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; padding: 12px 28px; background: rgba(6,5,5,.82); backdrop-filter: blur(20px) saturate(140%); border-bottom: 1px solid var(--ln); }
.brand { display: flex; align-items: center; gap: 10px; color: var(--t1); }
.brand svg { width: 22px; height: 22px; color: var(--t1); }
.brand b { font-weight: 600; font-size: 15px; } .brand span { color: var(--t3); font-size: 13.5px; }
.fl { flex: 1; }
.nav { display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 3px; border-radius: 8px; background: var(--s2); box-shadow: inset 0 0 0 1px var(--ln); font-size: 12.5px; }
.nav a { padding: 5px 11px; border-radius: 6px; color: var(--t2); font-weight: 500; }
.nav a:hover { color: var(--t1); background: var(--ln2); text-decoration: none; }
.cta { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 6px; background: var(--o); color: #000 !important; font-weight: 500; font-size: 13px; text-decoration: none !important; }
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 28px; }
.intro { margin: 40px auto 8px; }
.eyebrow { display: flex; flex-wrap: wrap; gap: 14px; font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--t3); margin-bottom: 12px; }
.eyebrow .a { color: var(--oT); }
.intro h1 { font-size: 44px; font-weight: 400; letter-spacing: -0.03em; margin: 0 0 12px; line-height: 1.1; }
.intro p { color: var(--t2); font-size: 15px; line-height: 1.55; max-width: 760px; margin: 0 0 18px; }
.card { margin: 40px 0 0; padding-top: 24px; border-top: 1px solid var(--ln); scroll-margin-top: 70px; }
.ch { display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px; }
.no { font-family: var(--mono); font-size: 12.5px; color: var(--oT); }
h2 { margin: 0; font-size: 26px; font-weight: 500; letter-spacing: -0.02em; }
h3 { font-size: 18px; font-weight: 500; letter-spacing: -0.015em; margin: 32px 0 8px; scroll-margin-top: 70px; }
p, li { color: var(--t2); font-size: 15.5px; line-height: 1.6; max-width: 780px; text-wrap: pretty; }
strong { color: var(--t1); font-weight: 500; } em { color: var(--t1); }
code { font: 13px var(--mono); background: var(--s2); color: var(--oT); padding: 1px 5px; border-radius: 4px; box-shadow: inset 0 0 0 1px var(--ln); }
pre { background: var(--s1); border: 1px solid var(--ln); padding: 14px; border-radius: 8px; overflow: auto; }
pre code { background: none; box-shadow: none; padding: 0; color: var(--t2); }
pre.mermaid { background: var(--s1); text-align: center; padding: 20px; }
pre.mermaid svg { max-height: 520px; max-width: 100%; }
p:has(> a > img) { max-width: none; }
img { display: block; width: 100%; border-radius: 10px; box-shadow: 0 0 0 1px var(--ln2), 0 20px 50px rgba(0,0,0,.5); cursor: zoom-in; margin: 18px 0 6px; }
a:has(img):hover img { box-shadow: 0 0 0 1px var(--o), 0 20px 50px rgba(0,0,0,.5); }
blockquote { border-left: 2px solid var(--o); margin: 0; padding-left: 14px; }
table { border-collapse: collapse; font-size: 14px; } td, th { border: 1px solid var(--ln2); padding: 6px 10px; color: var(--t2); text-align: left; } th { color: var(--t1); font-weight: 500; background: var(--s2); }
figure.anno { display: grid; grid-template-columns: minmax(0, 3fr) minmax(240px, 1fr); gap: 20px; margin: 18px 0 8px; align-items: start; width: min(1360px, calc(100vw - 48px)); position: relative; left: 50%; transform: translateX(-50%); }
figure.anno img { margin: 0; }
a.opts { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; padding: 8px 14px; border-radius: 6px; border: 1px solid var(--o); color: var(--oT); font-size: 13.5px; font-weight: 500; background: rgba(255,90,0,.08); }
a.opts:hover { background: rgba(255,90,0,.16); text-decoration: none; }
blockquote p { color: var(--t1); }
ol.notes { list-style: none; counter-reset: n; margin: 0; padding: 14px 16px; background: var(--s1); border: 1px solid var(--ln); border-radius: 10px; display: flex; flex-direction: column; gap: 12px; position: sticky; top: 70px; }
ol.notes li { counter-increment: n; display: grid; grid-template-columns: 22px 1fr; gap: 10px; font-size: 14px; line-height: 1.5; margin: 0; }
ol.notes li::before { content: counter(n); width: 20px; height: 20px; border-radius: 50%; background: var(--o); color: #000; font: 600 11px var(--mono); display: flex; align-items: center; justify-content: center; margin-top: 1px; }
@media (max-width: 800px) { figure.anno { grid-template-columns: 1fr; } ol.notes { position: static; } }footer.wrap { margin: 60px auto 40px; padding-top: 16px; border-top: 1px solid var(--ln); font-size: 12px; color: var(--t3); font-family: var(--mono); }
</style>`;
const brand = `<span class="brand">${mark}<b>Factory</b><span>${esc(label)}</span></span><span class="fl"></span>`;
const mermaidInit = `<script src="mermaid.min.js"></script><script>mermaid.initialize({ startOnLoad: true, theme: 'base', fontFamily: 'Geist', themeVariables: { darkMode: true, background: '#0c0b0a', primaryColor: '#151311', primaryBorderColor: '#2e2926', primaryTextColor: '#fdfcfb', secondaryColor: '#151311', tertiaryColor: '#0c0b0a', lineColor: '#ff5a00', textColor: '#b5ada7', edgeLabelBackground: '#0c0b0a', clusterBkg: '#0c0b0a', fontSize: '14px' } });</script>`;
const head = (t) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t)} · Factory</title><meta name="robots" content="noindex"><link rel="stylesheet" href="fonts.css">${style}</head><body>`;
fs.writeFileSync(path.join(S, 'index.html'), linkImages(`${head(`PRD: ${title}`)}
<header class="top">${brand}
<nav class="nav">${sections.map((s) => `<a href="#${slug(s)}">${esc(s)}</a>`).join('')}</nav>
${pdfName ? `<a class="cta" href="${pdfName}">PDF</a>` : ''}</header>
<div class="wrap">
<div class="intro"><div class="eyebrow"><span class="a">${esc(label)}</span></div>
<h1>${title}</h1>
${intro ? `<p>${esc(intro)}</p>` : ''}</div>
${body}</section>
</div>
<footer class="wrap">${esc(sourceArg ?? `Mirrors ${path.basename(mdPath)}, which is the source of truth`)} · built ${built} UTC</footer>
${mermaidInit}
<script src="review.js"></script>
</body></html>`));

// Question pages: <questions>/*.md -> <name>.html. A page whose Markdown has "> **Decided" gets a Decided eyebrow.
if (qdirArg && fs.existsSync(qdirArg)) {
  const qRenderer = new marked.Renderer();
  qRenderer.code = renderer.code;
  for (const f of fs.readdirSync(qdirArg).filter((f) => f.endsWith('.md'))) {
    let q = fs.readFileSync(path.join(qdirArg, f), 'utf8');
    copyAssets(q, qdirArg);
    const qt = (q.match(/^# (.*)$/m) || [, f])[1];
    q = q.replace(/^# .*\n/m, '');
    const decided = /^> \*\*Decided/m.test(q);
    fs.writeFileSync(path.join(S, f.replace(/\.md$/, '.html')), linkImages(`${head(qt)}
<header class="top">${brand}<a class="cta" href="index.html">Back to the PRD</a></header>
<div class="wrap"><div class="intro"><div class="eyebrow"><span class="a">${decided ? 'Decided' : 'Open question'}</span><span>${esc(title)}</span></div><h1>${qt}</h1></div>${pairFigures(marked.parse(q, { renderer: qRenderer }))}</div>
<footer class="wrap">built ${built} UTC</footer>${q.includes('```mermaid') ? mermaidInit : ''}<script src="review.js"></script></body></html>`));
  }
}
console.log(S);
