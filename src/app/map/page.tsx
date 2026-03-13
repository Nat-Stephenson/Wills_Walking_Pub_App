'use client';

import { useState } from 'react';
import GoogleMap from '@/components/GoogleMap';
import { routes } from '@/data/mockData';

export default function MapView() {
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  // For development, use a placeholder key - you'll need to replace this
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const completedRoutes = routes.filter(route => route.isCompleted);
  const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
  const totalPubs = routes.reduce((sum, route) => sum + route.pubs.length, 0);

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
            checked={showAllRoutes}
            onChange={(e) => setShowAllRoutes(e.target.checked)}
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

      {/* Google Map */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          height: '70vh',
          minHeight: '500px',
          position: 'relative'
        }}>
          <GoogleMap 
            apiKey={GOOGLE_MAPS_API_KEY} 
            showAllRoutes={showAllRoutes}
          />
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
            <strong>Total routes:</strong> {showAllRoutes ? routes.length : completedRoutes.length}
          </div>
          <div>
            <strong>Total distance:</strong> {totalDistance.toFixed(1)} km
          </div>
          <div>
            <strong>Completed routes:</strong> {completedRoutes.length}
          </div>
          <div>
            <strong>Pubs discovered:</strong> {totalPubs}
          </div>
        </div>
      </div>
    </div>
  );
}