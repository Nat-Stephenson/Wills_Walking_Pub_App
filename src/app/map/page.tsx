'use client';

import { useState, useMemo } from 'react';
import { routes } from '@/data/mockData';
import type { Route } from '@/types';

type SortOption = 'name-asc' | 'name-desc' | 'distance-asc' | 'distance-desc' | 
                  'difficulty-asc' | 'difficulty-desc' | 'duration-asc' | 'duration-desc' |
                  'completed-first' | 'incomplete-first' | 'region-asc';

export default function MapView() {
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(routes.map(route => route.region)));
    return uniqueRegions.sort();
  }, []);

  // Sort and filter routes
  const sortedAndFilteredRoutes = useMemo(() => {
    let filteredRoutes = showAllRoutes ? routes : routes.filter(route => route.isCompleted);
    
    // Apply region filter
    if (filterRegion !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => route.region === filterRegion);
    }

    // Apply sorting
    const sorted = [...filteredRoutes].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'distance-asc':
          return a.distance - b.distance;
        case 'distance-desc':
          return b.distance - a.distance;
        case 'difficulty-asc':
          const difficultyOrder = { 'Easy': 1, 'Moderate': 2, 'Challenging': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'difficulty-desc':
          const difficultyOrderDesc = { 'Easy': 3, 'Moderate': 2, 'Challenging': 1 };
          return difficultyOrderDesc[a.difficulty] - difficultyOrderDesc[b.difficulty];
        case 'duration-asc':
          return a.duration - b.duration;
        case 'duration-desc':
          return b.duration - a.duration;
        case 'completed-first':
          return b.isCompleted ? 1 : -1;
        case 'incomplete-first':
          return a.isCompleted ? 1 : -1;
        case 'region-asc':
          return a.region.localeCompare(b.region);
        default:
          return 0;
      }
    });

    return sorted;
  }, [showAllRoutes, sortBy, filterRegion]);

  const completedRoutes = sortedAndFilteredRoutes.filter(route => route.isCompleted);
  const totalDistance = sortedAndFilteredRoutes.reduce((sum, route) => sum + route.distance, 0);
  const totalPubs = sortedAndFilteredRoutes.reduce((sum, route) => sum + route.pubs.length, 0);

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
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          {/* Show all routes checkbox */}
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

          {/* Sorting and filtering controls */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* Region filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}>Region:</label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Sort by */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    minWidth: '140px'
                  }}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="distance-asc">Distance (Short-Long)</option>
                  <option value="distance-desc">Distance (Long-Short)</option>
                  <option value="difficulty-asc">Difficulty (Easy-Hard)</option>
                  <option value="difficulty-desc">Difficulty (Hard-Easy)</option>
                  <option value="duration-asc">Duration (Short-Long)</option>
                  <option value="duration-desc">Duration (Long-Short)</option>
                  <option value="completed-first">Completed First</option>
                  <option value="incomplete-first">Incomplete First</option>
                  <option value="region-asc">Region (A-Z)</option>
                </select>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  setShowAllRoutes(false);
                  setSortBy('name-asc');
                  setFilterRegion('all');
                }}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #92400e',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  color: '#92400e',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#92400e';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#92400e';
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
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
            <strong>Showing routes:</strong> {sortedAndFilteredRoutes.length}
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

      {/* Route List */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📋 Routes ({sortedAndFilteredRoutes.length})
        </h3>
        {sortedAndFilteredRoutes.length === 0 ? (
          <p style={{ 
            color: '#64748b', 
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '2rem'
          }}>
            No routes match your current filters.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1rem' 
          }}>
            {sortedAndFilteredRoutes.map((route) => (
              <div 
                key={route.id} 
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backgroundColor: route.isCompleted ? '#f0fdf4' : '#fefefe',
                  borderLeft: `4px solid ${
                    route.difficulty === 'Easy' ? '#10b981' :
                    route.difficulty === 'Moderate' ? '#f59e0b' : '#ef4444'
                  }`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    {route.name} {route.isCompleted && '✅'}
                  </h4>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: 
                      route.difficulty === 'Easy' ? '#dcfce7' :
                      route.difficulty === 'Moderate' ? '#fef3c7' : '#fee2e2',
                    color:
                      route.difficulty === 'Easy' ? '#166534' :
                      route.difficulty === 'Moderate' ? '#92400e' : '#991b1b'
                  }}>
                    {route.difficulty}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: '0 0 0.75rem 0',
                  lineHeight: 1.5
                }}>
                  {route.description}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <div>
                    <strong>📍 Region:</strong> {route.region}
                  </div>
                  <div>
                    <strong>📏 Distance:</strong> {route.distance} km
                  </div>
                  <div>
                    <strong>⏱️ Duration:</strong> {route.duration}h
                  </div>
                  <div>
                    <strong>🍺 Pubs:</strong> {route.pubs.length}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div>
                    <strong>Start:</strong> {route.startPoint.name}
                  </div>
                  <div>
                    <strong>End:</strong> {route.endPoint.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}