export default function MapView() {
  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Will's UK Walking Map
        </h2>
        <p style={{ color: '#64748b' }}>
          View all your walking routes across the United Kingdom
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            style={{ 
              width: '1rem', 
              height: '1rem',
              accentColor: '#92400e'
            }}
          />
          <span style={{ fontSize: '0.875rem' }}>
            Show all routes (including not completed)
          </span>
        </label>
      </div>

      {/* Static Map Placeholder */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          height: '70vh',
          minHeight: '500px',
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M40 0L0 0 0 40' fill='none' stroke='%23000' stroke-width='1'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'repeat'
          }} />
          
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#475569' }}>
              UK Walking Routes Map
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Interactive map visualization
            </p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              3 routes plotted across the UK
            </p>
          </div>
          
          {/* Mock route markers */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '40%',
            width: '12px',
            height: '12px',
            backgroundColor: '#92400e',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '35%',
            width: '12px',
            height: '12px',
            backgroundColor: '#92400e',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '45%',
            width: '12px',
            height: '12px',
            backgroundColor: '#16a34a',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>

      {/* Route Summary */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1rem' 
        }}>
          📊 Route Summary
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.875rem',
          color: '#475569'
        }}>
          <div>
            <strong>Total distance covered:</strong> 14.7 km
          </div>
          <div>
            <strong>Average difficulty:</strong> Moderate
          </div>
          <div>
            <strong>Regions explored:</strong> 3
          </div>
          <div>
            <strong>Pubs discovered:</strong> 5
          </div>
        </div>
      </div>
    </div>
  );
}