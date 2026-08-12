import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('categories').select('*')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase connection test</h1>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.map((cat) => (
            <li key={cat.id}>{cat.category_name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
