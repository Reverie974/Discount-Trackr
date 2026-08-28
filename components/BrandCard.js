export default function BrandCard({ brand }) {
  return (
    <div
      style={{
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '1rem',
        margin: '0.5rem 0',
      }}
    >
      <h3 style={{ margin: '0 0 0.25rem 0' }}>{brand.brand_name}</h3>

      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
        {brand.discount_amount}
      </p>

      {brand.description && (
        <p style={{ margin: '0 0 0.75rem 0', color: '#666' }}>
          {brand.description}
        </p>
      )}

      <a
        href={brand.redeem_link}
        /* target="_blank" + rel="noopener noreferrer" opens the link in a new tab */
        target="_blank"
        /* rel="noopener noreferrer" prevents tabnabbing attacks */
        rel="noopener noreferrer"
  
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Get Discount →
      </a>
    </div>
  )
}