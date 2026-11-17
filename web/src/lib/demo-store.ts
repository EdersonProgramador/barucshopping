import catalog from '@/data/demo-catalog.json';
import type { Category, Paginated, Product } from '@/types';
import type { ProductFilters } from '@/services/product.service';
import { API_URL } from '@/lib/api';

const products = catalog.products as Product[];
const categories = catalog.categories as Category[];

/** True when the SPA is on a public host but still pointing at localhost API. */
export function shouldUseDemoCatalog() {
  if (import.meta.env.VITE_USE_DEMO_CATALOG === 'true') return true;
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const appIsLocal = host === 'localhost' || host === '127.0.0.1';
  const apiIsLocal = /localhost|127\.0\.0\.1/.test(API_URL);
  return apiIsLocal && !appIsLocal;
}

function finalPrice(p: Product) {
  return Math.round(p.price * (1 - p.discount / 100));
}

function applyFilters(filters: ProductFilters): Product[] {
  let list = products.filter((p) => p.isActive);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.category) {
    list = list.filter((p) => p.category?.slug === filters.category);
  }
  if (filters.minPrice != null) {
    list = list.filter((p) => finalPrice(p) >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    list = list.filter((p) => finalPrice(p) <= filters.maxPrice!);
  }
  if (filters.minRating != null) {
    list = list.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.inStock) {
    list = list.filter((p) => p.stock > 0);
  }
  if (filters.featured) {
    list = list.filter((p) => p.isFeatured);
  }
  if (filters.onSale) {
    list = list.filter((p) => p.discount > 0);
  }

  switch (filters.sort) {
    case 'price_asc':
      list = [...list].sort((a, b) => finalPrice(a) - finalPrice(b));
      break;
    case 'price_desc':
      list = [...list].sort((a, b) => finalPrice(b) - finalPrice(a));
      break;
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case 'bestselling':
      list = [...list].sort((a, b) => b.sold - a.sold);
      break;
    case 'discount':
      list = [...list].sort((a, b) => b.discount - a.discount);
      break;
    case 'newest':
    default:
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
      break;
  }

  return list;
}

export function demoListProducts(filters: ProductFilters = {}): Paginated<Product> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const filtered = applyFilters(filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    },
  };
}

export function demoGetBySlug(slug: string): Product {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw Object.assign(new Error('Produto não encontrado'), { response: { status: 404 } });
  return product;
}

export function demoGetById(id: string): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw Object.assign(new Error('Produto não encontrado'), { response: { status: 404 } });
  return product;
}

export function demoRelated(slug: string): Product[] {
  const product = products.find((p) => p.slug === slug);
  if (!product) return [];
  return products
    .filter((p) => p.slug !== slug && p.categoryId === product.categoryId)
    .slice(0, 4);
}

export function demoCategories(): Category[] {
  return categories;
}

export function demoPriceHistory(id: string, days: 30 | 90 | 365) {
  const product = demoGetById(id);
  const current = finalPrice(product);
  const points = Math.min(days, 30);
  const data = Array.from({ length: points }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (points - 1 - i));
    const wobble = 1 + Math.sin(i / 3) * 0.04 + ((i % 5) - 2) * 0.01;
    return { date: date.toISOString().slice(0, 10), price: Math.round(current * wobble) };
  });
  const lowest90 = Math.min(...data.map((d) => d.price));
  return { data, current, lowest90, isLowest: current <= lowest90 };
}
