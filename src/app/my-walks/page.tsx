'use client';

import Image from 'next/image';

export default function MyWalks() {
  // Mock data for demonstration
  const mockCompletedRoutes = [
    {
      id: 1,
      name: 'Cotswolds Village Walk',
      description: 'A scenic walk through charming villages with pub stops',
      distance: 8.5,
      duration: 180,
      difficulty: 'Moderate',
      region: 'Cotswolds',
      pubs: [{name: 'The Red Lion'}, {name: 'The Crown Inn'}],
      completedDate: '2024-03-01'
    },
    {
      id: 3,
      name: 'Lake District Loop',
      description: 'Peaceful lakeside walk with traditional pubs',
      distance: 6.2,
      duration: 150,
      difficulty: 'Easy',
      region: 'Lake District',
      pubs: [{name: 'The Lakeside Inn'}, {name: 'Mountain View Pub'}],
      completedDate: '2024-02-15'
    }
  ];

  const totalDistance = mockCompletedRoutes.reduce((sum, route) => sum + route.distance, 0);
  const totalTime = mockCompletedRoutes.reduce((sum, route) => sum + route.duration, 0);
  const totalPubs = mockCompletedRoutes.reduce((sum, route) => sum + route.pubs.length, 0);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Will's Completed Walks
        </h2>
        <p style={{ color: '#64748b' }}>
          Track your walking achievements and memories
        </p>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Total Walks
          </div>
          <div style={{ fontSize: '2rem', color: '#92400e', fontWeight: 'bold' }}>
            {mockCompletedRoutes.length}
          </div>
        </div>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Total Distance
          </div>
          <div style={{ fontSize: '2rem', color: '#92400e', fontWeight: 'bold' }}>
            {totalDistance.toFixed(1)} miles
          </div>
        </div>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Total Time
          </div>
          <div style={{ fontSize: '2rem', color: '#92400e', fontWeight: 'bold' }}>
            {Math.floor(totalTime / 60)}h {totalTime % 60}m
          </div>
        </div>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Pubs Visited
          </div>
          <div style={{ fontSize: '2rem', color: '#92400e', fontWeight: 'bold' }}>
            {totalPubs}
          </div>
        </div>
      </div>

      {/* Completed Routes */}
      <div className="card">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ✅ Completed Routes
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {mockCompletedRoutes.map(route => (
            <div key={route.id} style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '150px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image
                  src="/WithoutName.png"
                  alt={route.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {route.name}
                </h4>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {route.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  fontSize: '0.875rem',
                  color: '#475569',
                  marginBottom: '0.5rem'
                }}>
                  <span>� {route.distance} miles</span>
                  <span>⏱️ {Math.floor(route.duration / 60)}h</span>  
                  <span>🍺 {route.pubs.length}</span>
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  Completed: {new Date(route.completedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}