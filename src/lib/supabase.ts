import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmnnbotyzwftlhwakbnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbm5ib3R5endmdGxod2FrYm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTE3MzYsImV4cCI6MjA2NzY2NzczNn0.QaHkN4M4_Deh4HN4CZ-spv8QKbGKzhrfGwMvr6Pbyv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  subcategory?: string;
  producer?: string;
  description?: string;
  slug?: string;
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

  // Filter archived, sort by order
  return allProducts
    .filter(p => !p.archived)
    .sort((a, b) => {
      const aOrder = a.order ?? 999999;
      const bOrder = b.order ?? 999999;
      return aOrder - bOrder;
    });
}

// Fetch product by ID — reliable, no slug issues
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}
