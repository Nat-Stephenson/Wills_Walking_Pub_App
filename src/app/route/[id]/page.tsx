'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RouteDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // Mock route data - in a real app, this would come from an API or database
  const mockRoute = {
    id: id,
    name: 'Cotswolds Village Walk',
    description: 'A scenic walk through charming Cotswold villages with traditional stone cottages and rolling hills.',
    distance: 8.5,
    duration: 180,
    difficulty: 'Moderate' as const,
    region: 'Cotswolds',
    startPoint: { name: 'Chipping Campden', lat: 52.0418, lng: -1.7814 },
    endPoint: { name: 'Broadway', lat: 52.0336, lng: -1.8611 },
    pubs: [
      {
        id: 'p1',
        name: 'The Kings Head Inn',
        description: 'Historic 16th-century coaching inn',
        latitude: 52.0380,
        longitude: -1.7900
      },
      {
        id: 'p2',
        name: 'The Crown and Trumpet',
        description: 'Traditional village pub with local ales',
        latitude: 52.0350,
        longitude: -1.8500
      }
    ]
  };

  const [isCompleted, setIsCompleted] = useState(false);

  const difficultyColors = {
    'Easy': { background: '#dcfce7', color: '#15803d' },
    'Moderate': { background: '#fef3c7', color: '#b45309' },
    'Challenging': { background: '#fee2e2', color: '#dc2626' }
  };

  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="container">
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: '1rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        ← Back to routes
      </button>

      {/* Hero Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          height: '300px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          color: 'white',
          marginBottom: '1.5rem'
        }}>
          🏞️
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {mockRoute.name}
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: '1.6' }}>
              {mockRoute.description}
            </p>
          </div>
          
          <span 
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              ...difficultyColors[mockRoute.difficulty]
            }}
          >
            {mockRoute.difficulty}
          </span>
        </div>

        {/* Route Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📏</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {mockRoute.distance} km
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Distance</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⏱️</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {Math.floor(mockRoute.duration / 60)}h {mockRoute.duration % 60}m
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Duration</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📈</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {mockRoute.difficulty}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Difficulty</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🍺</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {mockRoute.pubs.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pubs</div>
          </div>
        </div>

        {/* Completion Toggle */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={toggleCompleted}
            className="btn-primary"
            style={{
              background: isCompleted ? '#22c55e' : '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            {isCompleted ? '✅' : '⭕'} 
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </button>
        </div>
      </div>

      {/* Route Points */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          📍 Route Points
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              background: '#22c55e', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem'
            }}>
              🏁
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Start: {mockRoute.startPoint.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {mockRoute.startPoint.lat}, {mockRoute.startPoint.lng}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              background: '#ef4444', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem'
            }}>
              🎯
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>End: {mockRoute.endPoint.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {mockRoute.endPoint.lat}, {mockRoute.endPoint.lng}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pubs Along Route */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🍺 Pubs Along the Route ({mockRoute.pubs.length})
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {mockRoute.pubs.map(pub => (
            <div 
              key={pub.id} 
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: '#f8fafc'
              }}
            >
              <h3 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                {pub.name}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                {pub.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                📍 {pub.latitude}, {pub.longitude}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}