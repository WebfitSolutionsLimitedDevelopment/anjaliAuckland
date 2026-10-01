// Zero-dependency build: expands {{pic ...}} into responsive <picture> markup.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
const dims = { hero:[1066,1600], carpet:[1320,1318], palais:[1320,1316], sea:[1320,1319], floral:[1320,1633],
  staircase:[1320,1320], saree:[1066,1600], lavender:[1066,1600], heart:[1200,1600] };
const pic = (n, alt, sizes, eager) => {
  const [w, h] = dims[n]; const fw = Math.min(w, 1600);
  const set = ext => `/images/${n}-640.${ext} 640w, /images/${n}-full.${ext} ${fw}w`;
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="/images/${n}.jpg" alt="${alt}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
};
const html = readFileSync('src/index.html', 'utf8')
  .replace(/\{\{pic (\w+) "([^"]*)" "([^"]*)"( eager)?\}\}/g, (_, n, a, s, e) => pic(n, a, s, !!e));
if (html.includes('{{')) throw new Error('Unexpanded template tag');
writeFileSync('public/index.html', html);
for (const f of ['styles.css', 'main.js']) copyFileSync('src/' + f, 'public/' + f);
console.log('Built public/index.html');
