import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const seed = fs.readFileSync(path.join(root, 'server/prisma/seed.ts'), 'utf8');

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const catMatch = seed.match(/const categories = (\[[\s\S]*?\]);/);
const prodMatch = seed.match(/const products: SeedProduct\[\] = (\[[\s\S]*?\]);/);
if (!catMatch || !prodMatch) {
  console.error('Failed to parse seed arrays');
  process.exit(1);
}

const categories = eval(catMatch[1]);
const products = eval(prodMatch[1]);

const now = '2026-01-15T12:00:00.000Z';
const cats = categories.map((c, i) => ({
  id: `cat-${i + 1}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  parentId: null,
}));
const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));
const countBy = {};

const outProducts = products.map((p, i) => {
  const cat = catBySlug[p.category];
  countBy[cat.slug] = (countBy[cat.slug] || 0) + 1;
  const rating = 4 + ((i * 7) % 10) / 10;
  return {
    id: `prod-${i + 1}`,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    discount: p.discount ?? 0,
    images: p.images,
    categoryId: cat.id,
    category: { id: cat.id, name: cat.name, slug: cat.slug },
    stock: p.stock,
    rating: Math.round(rating * 10) / 10,
    reviewCount: 2 + (i % 5),
    sold: 5 + ((i * 13) % 90),
    tags: p.tags,
    isFeatured: Boolean(p.isFeatured),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
});

const catsWithCount = cats.map((c) => ({
  ...c,
  _count: { products: countBy[c.slug] || 0 },
}));

const outDir = path.join(root, 'web/src/data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'demo-catalog.json'),
  JSON.stringify({ categories: catsWithCount, products: outProducts })
);
console.log(`Wrote ${catsWithCount.length} categories, ${outProducts.length} products`);
