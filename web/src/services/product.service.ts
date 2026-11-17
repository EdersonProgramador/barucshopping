import { api } from '@/lib/api';
import {
  demoCategories,
  demoGetById,
  demoGetBySlug,
  demoListProducts,
  demoPriceHistory,
  demoRelated,
  shouldUseDemoCatalog,
} from '@/lib/demo-store';
import type { Category, Paginated, Product, RatingBucket, Review } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'bestselling' | 'discount';
}

function toParams(filters: ProductFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
}

async function withDemoFallback<T>(live: () => Promise<T>, demo: () => T): Promise<T> {
  if (shouldUseDemoCatalog()) return demo();
  try {
    return await live();
  } catch {
    return demo();
  }
}

export const productService = {
  async list(filters: ProductFilters = {}) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Product>>('/products', { params: toParams(filters) });
        return data;
      },
      () => demoListProducts(filters)
    );
  },

  async listAdmin(filters: ProductFilters = {}) {
    const { data } = await api.get<Paginated<Product>>('/products/admin/all', {
      params: toParams(filters),
    });
    return data;
  },

  async getBySlug(slug: string) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Product>(`/products/slug/${slug}`);
        return data;
      },
      () => demoGetBySlug(slug)
    );
  },

  async getById(id: string) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Product>(`/products/${id}`);
        return data;
      },
      () => demoGetById(id)
    );
  },

  async related(slug: string) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Product[]>(`/products/slug/${slug}/related`);
        return data;
      },
      () => demoRelated(slug)
    );
  },

  async priceHistory(id: string, days: 30 | 90 | 365) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<{
          data: { date: string; price: number }[];
          current: number;
          lowest90: number;
          isLowest: boolean;
        }>(`/products/${id}/price-history`, { params: { days } });
        return data;
      },
      () => demoPriceHistory(id, days)
    );
  },

  async reviews(productId: string, page = 1, sort: 'recent' | 'helpful' | 'rating' = 'recent') {
    const { data } = await api.get<Paginated<Review> & { distribution: RatingBucket[] }>(
      `/reviews/product/${productId}`,
      { params: { page, sort } }
    );
    return data;
  },

  async createReview(input: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }) {
    const { data } = await api.post<Review>('/reviews', input);
    return data;
  },

  async markReviewHelpful(reviewId: string) {
    const { data } = await api.post<{ id: string; helpfulCount: number }>(
      `/reviews/${reviewId}/helpful`
    );
    return data;
  },

  async uploadReviewImages(files: File[]) {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const { data } = await api.post<{ urls: string[] }>('/uploads/reviews', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.urls;
  },

  async subscribeStockAlert(productId: string, email: string) {
    const { data } = await api.post<{ message: string }>('/stock-alerts', { productId, email });
    return data;
  },

  async categories() {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Category[]>('/categories');
        return data;
      },
      () => demoCategories()
    );
  },
};

export interface UpsertProductInput {
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  stock: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export const adminProductService = {
  async create(input: UpsertProductInput) {
    const { data } = await api.post<Product>('/products', input);
    return data;
  },

  async update(id: string, input: Partial<UpsertProductInput>) {
    const { data } = await api.patch<Product>(`/products/${id}`, input);
    return data;
  },

  async remove(id: string) {
    await api.delete(`/products/${id}`);
  },

  async uploadImages(files: File[]) {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const { data } = await api.post<{ urls: string[] }>('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.urls;
  },
};
