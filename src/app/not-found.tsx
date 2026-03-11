export default function NotFound() {
  return (
    <div className="container" style={{ 
      textAlign: 'center', 
      paddingTop: '4rem',
      paddingBottom: '4rem' 
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🗺️</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Route Not Found
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Sorry, we couldn't find the walking route you're looking for.
      </p>
      <a 
        href="/"
        className="btn-primary"
        style={{ 
          display: 'inline-block',
          textDecoration: 'none' 
        }}
      >
        🏠 Back to Routes
      </a>
    </div>
  );
}