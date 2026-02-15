import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmnnbotyzwftlhwakbnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbm5ib3R5endmdGxod2FrYm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTE3MzYsImV4cCI6MjA2NzY2NzczNn0.QaHkN4M4_Deh4HN4CZ-spv8QKbGKzhrfGwMvr6Pbyv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Транслитерация для автогенерации slug
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
  'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'қ': 'q', 'ғ': 'g', 'ү': 'u', 'ұ': 'u', 'ө': 'o', 'ә': 'a', 'і': 'i',
  'ң': 'n', 'һ': 'h'
};

export function generateSlug(name: string, id: string): string {
  if (!name) return id;
  
  const transliterated = name
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
  
  // Always append short id for uniqueness
  const shortId = id.substring(0, 8);
  return transliterated ? `${transliterated}-${shortId}` : id;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  subcategory?: string;
  producer?: string;
  description?: string;
  slug: string;
  inBox?: string;
  archived?: boolean;
  order?: number;
}

// Fetch all products with pagination to bypass Supabase 1000 row limit
export async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  const pageSize = 1000;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .range(from, to);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allProducts.push(...data);
      hasMore = data.length === pageSize;
      page++;
    } else {
      hasMore = false;
    }
  }

  // Filter archived, generate slugs, sort by order (low order = top)
  return allProducts
    .filter(p => !p.archived)
    .map(p => ({
      ...p,
      slug: p.slug || generateSlug(p.name, p.id)
    }))
    .sort((a, b) => {
      // Products with order come first (lower number = higher priority)
      const aOrder = a.order ?? 999999;
      const bOrder = b.order ?? 999999;
      return aOrder - bOrder;
    });
}

// Fetch product by slug
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  // First try exact match in DB
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (data) {
    return {
      ...data,
      slug: data.slug || generateSlug(data.name, data.id)
    };
  }

  // Try to find by generated slug - extract short id from end of slug
  const idPart = slug.split('-').pop();
  if (idPart && idPart.length === 8) {
    const { data: candidates } = await supabase
      .from('products')
      .select('*')
      .ilike('id', `${idPart}%`);

    if (candidates) {
      const product = candidates.find(p => generateSlug(p.name, p.id) === slug);
      if (product) {
        return { ...product, slug: generateSlug(product.name, product.id) };
      }
    }
  }

  // Fallback: search all non-archived products
  const { data: allProducts } = await supabase
    .from('products')
    .select('*')
    .eq('archived', false);

  if (allProducts) {
    const product = allProducts.find(p => generateSlug(p.name, p.id) === slug);
    if (product) {
      return { ...product, slug: generateSlug(product.name, product.id) };
    }
  }

  return null;
}
