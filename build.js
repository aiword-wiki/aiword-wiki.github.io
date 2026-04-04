#!/usr/bin/env node
// 키워드별 독립 SEO 페이지 생성 + sitemap 갱신
// 사용법: node build.js

const fs = require('fs');
const path = require('path');

// data.js 로드 (const → var로 변환하여 eval 스코프 노출)
const dataContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf-8')
  .replace(/^const /gm, 'var ');
eval(dataContent);

const CATS = {prompting:'프롬프팅',model:'모델',tooling:'도구',data:'데이터',agent:'에이전트',infra:'인프라',safety:'안전',application:'응용'};
const BASE = 'https://aiword-wiki.github.io';
const OUT = path.join(__dirname, 'k');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g,' ').trim();
}

for (const e of D) {
  const title = `${e.t}${e.en && e.en !== e.t ? ' ('+e.en+')' : ''} — AI Wiki`;
  const desc = stripTags(e.sum).slice(0, 160);
  const url = `${BASE}/k/${e.id}.html`;
  const mainUrl = `${BASE}/#${e.id}`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(desc)}">
<meta name="keywords" content="${escHtml(e.tags.join(', '))}, AI, ${escHtml(e.t)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="AI Wiki">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escHtml(title)}">
<meta name="twitter:description" content="${escHtml(desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko" href="${url}">
<script type="application/ld+json">
${JSON.stringify({
  "@context":"https://schema.org",
  "@type":"DefinedTerm",
  "name": e.t,
  "alternateName": e.en || undefined,
  "description": stripTags(e.sum),
  "url": url,
  "inDefinedTermSet": {
    "@type":"DefinedTermSet",
    "name":"AI Wiki",
    "url": BASE + "/"
  }
}, null, 2)}
</script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Noto Sans KR',sans-serif;background:#F3F0EB;color:#4a4540;min-height:100vh;display:flex;justify-content:center;padding:40px 20px}
  .wrap{max-width:720px;width:100%;background:#fff;border-radius:16px;padding:48px 40px;border:1px solid #e4dfd8}
  .cat{font-size:11px;color:#a09888;margin-bottom:8px}
  .title{font-size:30px;font-weight:900;color:#2d2a26;margin-bottom:4px}
  .en{font-size:13px;color:#a09888;margin-bottom:24px}
  .body{color:#5a5550;line-height:1.8;font-size:15px}
  .body h4{font-size:16px;font-weight:700;color:#2d2a26;margin:24px 0 8px}
  .body p{margin-bottom:14px}
  .body code{background:#F3F0EB;padding:2px 6px;border-radius:4px;font-size:13px;color:#C4613A}
  .body strong{font-weight:700;color:#2d2a26}
  .tags{margin-top:24px;display:flex;flex-wrap:wrap;gap:8px}
  .tags span{background:#F3F0EB;color:#a09888;padding:4px 12px;border-radius:20px;font-size:12px}
  .back{display:inline-block;margin-top:32px;color:#C4613A;text-decoration:none;font-size:14px;font-weight:700}
  .back:hover{text-decoration:underline}
</style>
</head>
<body>
<div class="wrap">
  <div class="cat">${escHtml(CATS[e.c] || e.c)}</div>
  <div class="title">${escHtml(e.t)}</div>
  ${e.en && e.en !== e.t ? `<div class="en">${escHtml(e.en)}</div>` : '<div class="en"></div>'}
  <div class="body"><p>${e.sum}</p>${e.det}</div>
  ${e.tags.length ? `<div class="tags">${e.tags.map(t=>`<span>#${escHtml(t)}</span>`).join('')}</div>` : ''}
  <a class="back" href="${mainUrl}">← AI Wiki에서 더 보기</a>
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, `${e.id}.html`), html);
}

// sitemap.xml 갱신
const today = new Date().toISOString().slice(0,10);
const urls = [
  `  <url>\n    <loc>${BASE}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`
];
for (const e of D) {
  urls.push(`  <url>\n    <loc>${BASE}/k/${e.id}.html</loc>\n    <lastmod>${e.updated || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

console.log(`✓ ${D.length}개 키워드 페이지 생성 → /k/`);
console.log(`✓ sitemap.xml 갱신 (${urls.length} URLs)`);
