//this file contains the logic for fetching brands by category from the database, for the category browsing page

import { supabase } from './supabase'; // adjust import to match your existing client setup

export async function getBrandsByCategory(categoryName) {
  // "all" case — no category filter, just return active brands
  if (!categoryName || categoryName === 'all') {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching all brands:', error);
      return [];
    }
    return data;
  }

  // filtered case — join through brand_categories on category_name
  const { data, error } = await supabase
    .from('brand_categories')
    .select(`
      brand_id,
      brands!inner (*),
      categories!inner (category_name)
    `)
    .eq('categories.category_name', categoryName)
    .eq('brands.is_active', true);

  if (error) {
    console.error('Error fetching brands by category:', error);
    return [];
  }

  // flatten the join result so it returns the same shape as the "all" case
  return data.map((row) => row.brands);
}