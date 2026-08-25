//this file *only* contains the search logic for brands and categories in the database

//importing supabase client from another supabase.js - supabase object allows communication with the database
import { supabase } from './supabase'

//term is the user's search input, export means other files can import and use this function.
export async function searchBrands(term) {
  //!term checks if the term exists, term.trim() removes whitespace from both ends of the string and checks if it's empty.
  if (!term || term.trim() === '') {
    return []
  }

  term = term.trim()

  //match on brand name directly - supabase returns { data: [...], error: null}, data array is stored in byBrandName, error in brandError. 
  const { data: byBrandName, error: brandError } = await supabase
    .from('brands')
    .select('*') //SELECT * FROM brands
    .ilike('brand_name', `%${term}%`) //performs case insensitive search. Example: %nike% matches Nike, Nike Outlet, SuperNikeStore
    .eq('is_active', true) //WHERE is_active = true

  // Match via category name (joined through brand_categories)
  const { data: byCategory, error: categoryError } = await supabase
    .from('brand_categories')
    //join the categories table with the brand_categories table, and at the same time retrieve the related brands
    //think of brand_categories table as a map, not the actual data we want to return. We want the brands that are related to the categories that match the search term.
    //SELECT brands.*, categories.category_name FROM brand_categories INNER JOIN brands ON brands.id = brand_categories.brand_id INNER JOIN categories ON categories.id = brand_categories.category_id
    .select('brands(*), categories!inner(category_name)')
    .ilike('categories.category_name', `%${term}%`)

  //added search functionality for tags, which are stored in a separate table called brand_tags. 
  //This query joins the brand_tags table with the brands and tags tables, and retrieves the brands that are related to the tags that match the search term. 
  const { data: byTag, error: tagError } = await supabase
    .from('brand_tags')
    .select('brands(*), tags!inner(tag_name)')
    .ilike('tags.tag_name', `%${term}%`)
  
  if (brandError) console.error('Brand search error:', brandError)
  if (categoryError) console.error('Category search error:', categoryError)
  if (tagError) console.error('Tag search error:', tagError)

  const brandResults = byBrandName || [] //this means brandResults will use byBrandName. But if byBrandName is falsy (such as null), use an empty array instead.
  const categoryResults = (byCategory || [])
    .map((row) => row.brands) // for every row in byCategory (stores the brand and category information), extract the brands object (row.brands) and return it as an array
    .filter((b) => b && b.is_active) //removes null and inactive brands from the results
  const tagResults = (byTag || [])
    .map((row) => row.brands)
    .filter((b) => b && b.is_active)

  // Merge and remove duplicates (a brand could match both ways)
  const merged = [...brandResults, ...categoryResults, ...tagResults] // merges the three arrays into one array, with brandResults first, followed by categoryResults and then tagResults. This is done using the spread operator (...), which spreads the elements of each array into a new array.
  //this line creates a new Map object, where each brand is stored with its id as the key. This automatically removes duplicates because keys in a Map must be unique. Then, it converts the Map back into an array of unique brand objects using Array.from() and .values().
  const unique = Array.from(new Map(merged.map((b) => [b.id, b])).values()) 

  return unique
}
/*
  unique = Array.from(new Map(merged.map((b) => [b.id, b])).values())
  first, merged.map((b) => [b.id, b])
  converts:
    [
      { id: 1, brand_name: "Nike" },
      { id: 1, brand_name: "Nike" },
      { id: 3, brand_name: "Herschel" }
    ]
  into:
    [
      [1, Nike],
      [1, Nike],
      [3, Herschel]
    ]
  then map removes duplicates as the map object cannot have duplicate keys:
  duplicate 1 is automotically removed, leaving:
    Map
    {
      1 → Nike
      3 → Herschel
    }
  then .values() extracts Nike and Herschel from the map
  Array.from() converts the values into an array:
    [
      { id: 1, brand_name: "Nike" },
      { id: 3, brand_name: "Herschel" }
    ]
  this array is returned. 
*/
