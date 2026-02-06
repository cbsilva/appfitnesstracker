import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('./src');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fullPath.endsWith('.ts')) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // adiciona .js apenas em imports relativos sem extensão
    content = content.replace(
      /(from\s+['"])(\.{1,2}\/[^'"]+?)(['"])/g,
      (match, p1, p2, p3) => {
        if (p2.endsWith('.js') || p2.endsWith('.json')) return match;
        return `${p1}${p2}.js${p3}`;
      }
    );

    fs.writeFileSync(fullPath, content);
  }
}

walk(SRC_DIR);
console.log('✅ Imports corrigidos com .js');
