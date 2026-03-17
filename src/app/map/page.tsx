'use client';

import { useState, useMemo } from 'react';
import { routes } from '@/data/mockData';
import type { Route } from '@/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import MapIcon from '@/assets/Map.png';
import TrekIcon from '@/assets/Trek.png';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type SortOption = 'name-asc' | 'name-desc' | 'distance-asc' | 'distance-desc' | 
                  'difficulty-asc' | 'difficulty-desc' | 'duration-asc' | 'duration-desc' |
                  'completed-first' | 'incomplete-first' | 'region-asc';

export default function MapView() {
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRoutesOnMap, setShowRoutesOnMap] = useState(true);
  const [showCompletedOnlyOnMap, setShowCompletedOnlyOnMap] = useState(false);
  const [selectedRouteOnMap, setSelectedRouteOnMap] = useState<string | null>(null);

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Will's UK Walking Routes
        </h2>
        <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
          Explore all your walking routes across the United Kingdom with interactive map tracking
        </p>
        <div style={{ 
          padding: '0.75rem 1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#1e40af'
        }}>
          <strong>🗺️ Map Features:</strong> View routes on the interactive map • Click route cards to focus on specific routes • See start/end points and pubs along each route • Toggle completed vs all routes
        </div>
      </div>

      {/* Map and Route List Split View */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        minHeight: '60vh'
      }}
      className="split-view"
      >
        {/* Map Section */}
        <div className="card" style={{ 
          padding: '0',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Image src={MapIcon} alt="Map" width={24} height={24} />
              Interactive Map
            </h3>
          </div>
          <div style={{ height: '70vh' }} className="map-container">
            <Map 
              routes={showRoutesOnMap ? sortedAndFilteredRoutes : []}
              showCompletedOnly={showCompletedOnlyOnMap}
              selectedRoute={selectedRouteOnMap}
            />
          </div>
        </div>

        {/* Map Controls */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            margin: '0 0 0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Image src={TrekIcon} alt="Trek" width={20} height={20} />
            Map Controls
          </h4>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}
          className="map-controls"
          >
            {/* Show routes toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showRoutesOnMap}
                onChange={(e) => setShowRoutesOnMap(e.target.checked)}
                style={{ 
                  width: '1rem', 
                  height: '1rem',
                  accentColor: '#92400e'
                }}
              />
              <span>Show routes on map</span>
            </label>
            
            {/* Show completed only toggle */}
            {showRoutesOnMap && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showCompletedOnlyOnMap}
                  onChange={(e) => setShowCompletedOnlyOnMap(e.target.checked)}
                  style={{ 
                    width: '1rem', 
                    height: '1rem',
                    accentColor: '#92400e'
                  }}
                />
                <span>Show completed routes only</span>
              </label>
            )}
            
            {/* Route selector */}
            {showRoutesOnMap && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Focus route:</label>
                <select
                  value={selectedRouteOnMap || 'all'}
                  onChange={(e) => setSelectedRouteOnMap(e.target.value === 'all' ? null : e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    flex: '1'
                  }}
                >
                  <option value="all">All Routes</option>
                  {sortedAndFilteredRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.name} {route.isCompleted ? '✅' : '⏳'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Route List Section */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📋 Route Summary
          </h3>
          
          {/* Route Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#475569'
          }}>
            <div>
              <strong>Total routes:</strong> {sortedAndFilteredRoutes.length}
            </div>
            <div>
              <strong>Total distance:</strong> {totalDistance.toFixed(1)} miles
            </div>
            <div>
              <strong>Completed:</strong> {completedRoutes.length}
            </div>
            <div>
              <strong>Pubs found:</strong> {totalPubs}
            </div>
          </div>

          {/* Quick Route List */}
          <div style={{ 
            maxHeight: '35vh',
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            {sortedAndFilteredRoutes.slice(0, 8).map(route => (
              <div 
                key={route.id}
                style={{ 
                  padding: '0.75rem',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem'
                }}>
                  <h4 style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    margin: '0',
                    color: '#1f2937'
                  }}>
                    {route.name}
                  </h4>
                  <span style={{
                    fontSize: '0.75rem',
                    color: route.isCompleted ? '#166534' : '#92400e'
                  }}>
                    {route.isCompleted ? '✅' : '⏳'}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: '#64748b',
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <span>📍 {route.region}</span>
                  <span>📏 {route.distance} miles</span>
                  <span>⏱️ {route.duration}h</span>
                </div>
              </div>
            ))}
            {sortedAndFilteredRoutes.length > 8 && (
              <div style={{ 
                padding: '0.75rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                ...and {sortedAndFilteredRoutes.length - 8} more routes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          {/* View Mode Selector */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>View:</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { key: 'grid', label: 'Grid View', icon: '⚏' },
                { key: 'list', label: 'List View', icon: '☰' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    border: `1px solid ${viewMode === key ? '#92400e' : '#d1d5db'}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: viewMode === key ? '#92400e' : 'white',
                    color: viewMode === key ? 'white' : '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

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
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center'
          }}
          className="map-controls"
          >
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

      {/* Detailed Route List/Grid */}
      <div className="card">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📋 Detailed Routes ({sortedAndFilteredRoutes.length})
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
            gridTemplateColumns: viewMode === 'grid' 
              ? 'repeat(auto-fit, minmax(350px, 1fr))' 
              : '1fr',
            gap: '1.5rem'
          }}
          className="route-grid"
          >
            {sortedAndFilteredRoutes.map(route => (
              <div 
                key={route.id}
                onClick={() => setSelectedRouteOnMap(route.id)}
                style={{ 
                  padding: '1.5rem', 
                  border: selectedRouteOnMap === route.id ? '2px solid #92400e' : '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                className="route-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#92400e';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedRouteOnMap === route.id ? '#92400e' : '#e2e8f0';
                  e.currentTarget.style.boxShadow = selectedRouteOnMap === route.id ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none';
                }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '1rem' 
                }}>
                  <h4 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    margin: '0',
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {route.name}
                    {selectedRouteOnMap === route.id && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#92400e',
                        color: 'white',
                        borderRadius: '0.375rem',
                        fontWeight: '500'
                      }}>
                        🗺️ Focused
                      </span>
                    )}
                  </h4>
                  <span style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: route.isCompleted ? '#dcfce7' : '#fef3c7',
                    color: route.isCompleted ? '#166534' : '#92400e'
                  }}>
                    {route.isCompleted ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </div>
                
                {/* Description */}
                <p style={{ 
                  margin: '0 0 1.25rem 0', 
                  color: '#64748b',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {route.description}
                </p>
                
                {/* Route Details */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' 
                    ? 'repeat(2, 1fr)' 
                    : 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: '#475569',
                  marginBottom: '1rem'
                }}
                className="route-details-grid"
                >
                  <div><strong>📍 Region:</strong> {route.region}</div>
                  <div><strong>� Distance:</strong> {route.distance} miles</div>
                  <div><strong>⏱️ Duration:</strong> {route.duration}h</div>
                  <div><strong>📈 Difficulty:</strong> {route.difficulty}</div>
                </div>

                {/* Location Details */}
                <div style={{ 
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  <div style={{ marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#475569' }}>🚩 Start:</strong> {route.startPoint.name}
                  </div>
                  <div>
                    <strong style={{ color: '#475569' }}>🏁 End:</strong> {route.endPoint.name}
                  </div>
                </div>
                
                {/* Pubs */}
                {route.pubs.length > 0 && (
                  <div style={{ 
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    <strong style={{ color: '#475569' }}>🍺 Pubs on Route:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      {route.pubs.map(pub => (
                        <div key={pub.id} style={{ 
                          color: '#64748b',
                          marginBottom: '0.25rem'
                        }}>
                          • <strong>{pub.name}</strong> - {pub.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}