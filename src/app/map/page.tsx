'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Route } from '@/types';
import type { User } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import MapIcon from '@/assets/Map.png';
import TrekIcon from '@/assets/Trek.png';

// Dynamically import Map with real routing API
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type SortOption = 'name-asc' | 'name-desc' | 'distance-asc' | 'distance-desc' | 
                  'difficulty-asc' | 'difficulty-desc' | 'duration-asc' | 'duration-desc' |
                  'completed-first' | 'incomplete-first' | 'region-asc';

export default function MapView() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRoutesOnMap, setShowRoutesOnMap] = useState(true);
  const [showCompletedOnlyOnMap, setShowCompletedOnlyOnMap] = useState(false);
  const [selectedRouteOnMap, setSelectedRouteOnMap] = useState<string | null>(null);

  // Load routes from Supabase
  useEffect(() => {
    loadRoutesFromSupabase();
  }, []);

  const loadRoutesFromSupabase = async () => {
    try {
      setLoading(true);
      console.log('Loading routes from Supabase...');
      
      const { data: routesData, error } = await supabase
        .from('walking_routes')
        .select('*')
        .order('route_name');

      console.log('Supabase response:', { data: routesData, error });

      if (error) {
        console.error('Supabase error:', error);
        alert(`Database error: ${error.message}`);
        return;
      }

      if (!routesData || routesData.length === 0) {
        console.warn('No routes found in database');
        setRoutes([]);
        return;
      }

      console.log(`Found ${routesData.length} routes in database`);

      const transformedRoutes = routesData
        .filter(route => {
          const hasCoords = route.start_latitude && route.start_longitude && 
                           route.pub_latitude && route.pub_longitude && 
                           route.end_latitude && route.end_longitude;
          
          if (!hasCoords) {
            console.warn('Skipping route with missing coordinates:', route.route_name);
          }
          return hasCoords;
        })
        .map(route => {
          try {
            return {
              id: route.id?.toString() || Math.random().toString(),
              name: route.route_name || 'Unnamed Route',
              description: route.description || route.historical_fact || 'No description available',
              distance: route.distance || '5 km',
              duration: route.estimated_time || route.duration || 'Unknown time',
              difficulty: (route.difficulty as 'Easy' | 'Moderate' | 'Challenging') || 'Moderate',
              region: route.region || 'UK',
              imageUrl: '/placeholder.jpg',
              isCompleted: false,
              historicalFacts: route.historical_fact ? [route.historical_fact] : [],
              start_latitude: parseFloat(route.start_latitude),
              start_longitude: parseFloat(route.start_longitude),
              pub_latitude: parseFloat(route.pub_latitude),
              pub_longitude: parseFloat(route.pub_longitude),
              end_latitude: parseFloat(route.end_latitude),
              end_longitude: parseFloat(route.end_longitude),
              pub_name: route.pub_name || 'Unknown Pub'
            };
          } catch (transformError) {
            console.error('Error transforming route:', route.route_name, transformError);
            return null;
          }
        })
        .filter((route): route is Route => route !== null);

      console.log(`Successfully transformed ${transformedRoutes.length} routes`);
      setRoutes(transformedRoutes);
      
    } catch (error) {
      console.error('Fatal error loading routes:', error);
      alert(`Failed to load routes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(routes.map(route => route.region)));
    return uniqueRegions.sort();
  }, []);

  // Sort and filter routes - show ALL routes by default
  const sortedAndFilteredRoutes = useMemo(() => {
    let filteredRoutes = routes; // Show all routes, not just completed ones
    
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
          const aDistance = parseFloat(a.distance) || 0;
          const bDistance = parseFloat(b.distance) || 0;
          return aDistance - bDistance;
        case 'distance-desc':
          const aDistanceDesc = parseFloat(a.distance) || 0;
          const bDistanceDesc = parseFloat(b.distance) || 0;
          return bDistanceDesc - aDistanceDesc;
        case 'difficulty-asc':
          const difficultyOrder = { 'Easy': 1, 'Moderate': 2, 'Challenging': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'difficulty-desc':
          const difficultyOrderDesc = { 'Easy': 3, 'Moderate': 2, 'Challenging': 1 };
          return difficultyOrderDesc[a.difficulty] - difficultyOrderDesc[b.difficulty];
        case 'duration-asc':
          const aDuration = parseFloat(a.duration) || 0;
          const bDuration = parseFloat(b.duration) || 0;
          return aDuration - bDuration;
        case 'duration-desc':
          const aDurationDesc = parseFloat(a.duration) || 0;
          const bDurationDesc = parseFloat(b.duration) || 0;
          return bDurationDesc - aDurationDesc;
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
  const totalDistance = sortedAndFilteredRoutes.reduce((sum, route) => {
    const distance = parseFloat(route.distance);
    return sum + (isNaN(distance) ? 0 : distance);
  }, 0);
  const totalPubs = sortedAndFilteredRoutes.length;

  // Loading state
  if (loading) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>🗺️</div>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading walking routes...</div>
        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Fetching data from database</div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Debug: Check browser console for logs</div>
      </div>
    );
  }

  // Empty state
  if (routes.length === 0) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>🚫</div>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>No routes found</div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
          No walking routes were found in the database.<br />
          Check your database connection and ensure routes exist in the walking_routes table.
        </div>
        <button 
          onClick={loadRoutesFromSupabase}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          🔄 Retry Loading Routes
        </button>
      </div>
    );
  }

  // Add debug info
  console.log('Map page rendering with:', {
    routesCount: routes.length,
    filteredCount: sortedAndFilteredRoutes.length,
    sampleRoute: routes[0]
  });

  return (
    <div>
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
                    <strong style={{ color: '#475569' }}>🚩 Start:</strong> {route.start_latitude.toFixed(4)}, {route.start_longitude.toFixed(4)}
                  </div>
                  <div>
                    <strong style={{ color: '#475569' }}>🏁 End:</strong> {route.end_latitude.toFixed(4)}, {route.end_longitude.toFixed(4)}
                  </div>
                </div>
                
                {/* Pubs */}
                {route.pub_name && (
                  <div style={{ 
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    <strong style={{ color: '#475569' }}>🍺 Pub on Route:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ 
                        color: '#64748b',
                        marginBottom: '0.25rem'
                      }}>
                        • <strong>{route.pub_name}</strong>
                      </div>
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