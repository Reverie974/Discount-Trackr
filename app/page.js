//by default, Next.js components are server components, which means they are rendered on the server and sent to the client as HTML. 
//tells Next.js to run this component in the user's browser, useState(), useEffect() and onChange() only work in client components, not server components. 
//This is because they rely on the browser's DOM and user interactions, which are not available on the server side.
'use client'

//importing functions from react and other libraries to use in this component
import { useState, useEffect } from 'react' //react is not a file/folder in the project directory, it is a dependency installed in the node_modules folder.
import { searchBrands } from '../lib/search'
import BrandCard from '../components/BrandCard' //importing BrandCard which displays a brand's name and its details.

//imports your databse connection
import { supabase } from '../lib/supabase'

//creating a React component called Home, which is the default export of this file. This component will be rendered on the client side.
//since its the only export in this file, Next.js automatically treats it as the homepage of the app. 
export default function Home() {
  //useState creates variables whose value can change while the app is running
  //these are not arrays, but rather 2 variables that hold a single value.
  //The first value is the current state, and the second value is a function that can be used to update the state.
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('') //value of the query is set inside the HTML below.
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  //this fills categories variable with data from database. 
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('category_name')
      setCategories(data || [])
    }
    loadCategories()
  }, [])

  useEffect(() => {
    //if query is empty
    if (query.trim() === '') {
      setResults([])
      return
    }

    setLoading(true)
    //debouncing
    const timeout = setTimeout(async () => {
      const data = await searchBrands(query)
      setResults(data)
      setLoading(false) //database search is complete. 
    }, 300) //wait 300 milliseconds so user can type before searching tje database

    return () => clearTimeout(timeout) //ensure only the newest search results return if user retypes
  }, [query]) //everytime the query changes, this effect runs again

  //everything below determines what the user sees
  return (
    /* this creates the search box */
    <main style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1>Discount Trackr</h1>

      <input
        type="text"
        placeholder="Search for a product, e.g. laptop"
        value={query} 
        /*e is an event object - run this code whenever the value inside the input box changes, target refers to the HTML element that triggered the event*/
        /*eg. e.target.value = "lap", then setQuery("lap")*/
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
      />

      {/*if loading is true, then return <p>Searching...</p>*/}
      {loading && <p>Searching...</p>}

      {query.trim() !== '' && !loading && (
        <div>
          {results.length === 0 ? (
            <p>No brands found for "{query}"</p>
          ) : (
            results.map((brand) => (
              <BrandCard key={brand.id} brand={brand} /> //using the BrandCard component to display each brand in the results array. 
              //The key prop is used by React to keep track of which items have changed, been added, or removed.
              //each element (brand) in the results array is an object (think of it as a JSON object) that contains the brand's details, which are passed to the BrandCard component as a prop.
              //in brand={brand}, brand on the right is an object from the results array, and brand on the left is the name of the prop passed to BrandCard function/component to access the brand's details.
              //name of the prop should match the name of the parameter in the BrandCard function/component, which is also called brand.
            ))
          )}
        </div>
      )}
      {/*if nothing has been typed by user, display all categories*/}
      {query.trim() === '' && (
        <div>
          <h2>Browse by category</h2>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>{cat.category_name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
