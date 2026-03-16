'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { getRouteById } from '@/data/mockData';

export default function RouteDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // Get the actual route data
  const route = getRouteById(id);
  
  // If route not found, show error
  if (!route) {
    return (
      <div className="container">
        <h1>Route not found</h1>
        <button onClick={() => router.back()}>← Back to routes</button>
      </div>
    );
  }

  const [isCompleted, setIsCompleted] = useState(route.isCompleted);

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
          position: 'relative',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          <Image
            src="/WithoutName.png"
            alt={route.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {route.name}
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: '1.6' }}>
              {route.description}
            </p>
          </div>
          
          <span 
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              ...difficultyColors[route.difficulty]
            }}
          >
            {route.difficulty}
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
              {route.distance} km
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Distance</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⏱️</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {Math.floor(route.duration)}h {Math.round((route.duration % 1) * 60)}m
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Duration</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📈</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {route.difficulty}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Difficulty</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🍺</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {route.pubs.length}
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
              <div style={{ fontWeight: '600' }}>Start: {route.startPoint.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {route.startPoint.lat}, {route.startPoint.lng}
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
              <div style={{ fontWeight: '600' }}>End: {route.endPoint.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {route.endPoint.lat}, {route.endPoint.lng}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Facts & Interesting Information */}
      {route.historicalFacts && route.historicalFacts.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📜 Historical Facts & Points of Interest
          </h2>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {route.historicalFacts.map((fact, index) => (
              <div 
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  borderLeft: '4px solid #92400e'
                }}
              >
                <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
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
          🍺 Pubs Along the Route ({route.pubs.length})
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {route.pubs.map(pub => (
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