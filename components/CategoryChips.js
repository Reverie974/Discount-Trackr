// Dumb/presentational component: takes data + a callback as props,
// doesn't own any state itself. page.js still owns selectedCategory.
export default function CategoryChips({ categories, selectedCategory, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
      <button
        onClick={() => onSelect('all')}
        style={selectedCategory === 'all' ? chipStyleActive : chipStyle}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.category_name)}
          style={selectedCategory === cat.category_name ? chipStyleActive : chipStyle}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  )
}

const chipStyle = {
  padding: '0.4rem 0.9rem',
  borderRadius: '999px',
  //border: '1px solid #ccc', //this is called short-hand because im setting several properties in one line.
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#ccc',
  background: '#000000',
  cursor: 'pointer',
  fontSize: '0.9rem',
}

const chipStyleActive = {
  ...chipStyle,
  //this is called long-hand because im setting each property on a separate line. 
  //stay consistent, don't mix short-hand and long-hand in the same object.
  background: '#222',
  color: '#fff',
  borderColor: '#222',
}