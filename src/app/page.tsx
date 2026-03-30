'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Route } from '@/types';
import type { User } from '@supabase/supabase-js';
import Auth from '@/components/Auth';
import styles from './page.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [regions, setRegions] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userCompletedRoutes, setUserCompletedRoutes] = useState<Set<string>>(new Set());
  const [showAuth, setShowAuth] = useState(false);

  // Load initial data and set up auth listener
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserCompletedRoutes(session.user.id);
        } else {
          setUserCompletedRoutes(new Set());
        }
      }
    );

    getInitialSession();
    loadRoutesFromSupabase();

    return () => subscription.unsubscribe();
  }, []);

  // Load routes from Supabase
  const loadRoutesFromSupabase = async () => {
    try {
      setLoading(true);
      console.log('Starting to load routes from Supabase...');
      
      // Load routes from single walking_routes table
      const { data: routesData, error: routesError } = await supabase
        .from('walking_routes')
        .select('*');

      console.log('Routes query result:', { routesData, routesError, count: routesData?.length });

      if (routesError) {
        console.error('Error loading routes:', routesError);
        alert(`Error loading routes: ${routesError.message}`);
        return;
      }

      // Transform Supabase data to match our Route type, using DB fields directly
      const transformedRoutes: Route[] = routesData
        .map(route => {
          // Validate coordinates first
          const validateCoordinate = (coord: any): number => {
            const num = parseFloat(coord);
            return isNaN(num) ? null : num;
          };

          const startLat = validateCoordinate(route.start_latitude);
          const startLng = validateCoordinate(route.start_longitude);
          const pubLat = validateCoordinate(route.pub_latitude);
          const pubLng = validateCoordinate(route.pub_longitude);
          const endLat = validateCoordinate(route.end_latitude);
          const endLng = validateCoordinate(route.end_longitude);

          // Skip routes with invalid coordinates
          if (!startLat || !startLng || !pubLat || !pubLng || !endLat || !endLng) {
            console.warn('Skipping route with invalid coordinates:', route.route_name);
            return null;
          }

          return {
            id: route.id,
            name: route.route_name,
            description: route.description || route.historical_fact || '',
            distance: route.distance || 'Unknown',
            duration: route.duration || 'Unknown',
            difficulty: (route.difficulty as 'Easy' | 'Moderate' | 'Challenging') || 'Moderate',
            region: route.region || 'UK',
            imageUrl: '/placeholder.jpg', // Default
            isCompleted: false, // Will be updated based on user data
            historicalFacts: [route.historical_fact],
            start_latitude: startLat,
            start_longitude: startLng,
            pub_latitude: pubLat,
            pub_longitude: pubLng,
            end_latitude: endLat,
            end_longitude: endLng,
            pub_name: route.pub_name || 'Unknown Pub'
          };
        })
        .filter(route => route !== null); // Remove null entries from invalid coordinates

      setRoutes(transformedRoutes);
      
      // Extract unique regions
      const uniqueRegions = ['all', ...Array.from(new Set(transformedRoutes.map(route => route.region)))];
      setRegions(uniqueRegions);
      
      console.log('Successfully loaded routes:', transformedRoutes.length);

    } catch (error) {
      console.error('Error loading routes:', error);
      alert(`Unexpected error loading routes: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Load user's completed routes
  const loadUserCompletedRoutes = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_completions')
      .select('route_id')
      .eq('user_id', userId);

    if (!error && data) {
      setUserCompletedRoutes(new Set(data.map(completion => completion.route_id)));
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Filter routes based on search and region
  const getFilteredRoutes = (): Route[] => {
    let filteredRoutes = routes;

    // Filter by region
    if (selectedRegion !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => 
        route.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredRoutes = filteredRoutes.filter(route =>
        route.name.toLowerCase().includes(searchLower) ||
        route.description.toLowerCase().includes(searchLower) ||
        route.region.toLowerCase().includes(searchLower)
      );
    }

    // Mark completed routes for authenticated users
    if (user) {
      filteredRoutes = filteredRoutes.map(route => ({
        ...route,
        isCompleted: userCompletedRoutes.has(route.id)
      }));
    }

    return filteredRoutes;
  };

  const filteredRoutes = getFilteredRoutes();

  // Show authentication modal if not logged in and user wants to access auth features
  if (showAuth && !user) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          position: 'relative',
          minWidth: '400px'
        }}>
          <button
            onClick={() => setShowAuth(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* Auth Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)'
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Welcome, {user.email}</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuth(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        )}
      </div>

      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/LogoWithName.png"
            alt="Will's Walks Main Logo"
            width={300}
            height={75}
            priority
            className={styles.mainLogo}
          />
        </div>
        <h2 className={styles.title}>Discover, Pint, Enjoy</h2>
        <p className={styles.subtitle}>
          This is Will's personal library of pub walks, made simple to share. Save routes, read interesting notes, and pick your next adventure.
        </p>
        {user && (
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            🎉 You have completed {userCompletedRoutes.size} routes!
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading walking routes...</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className={styles.searchContainer}>
            <div style={{ position: 'relative' }}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Filter */}
          <div className={styles.filterContainer}>
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`${styles.filterButton} ${
                  selectedRegion === region ? styles.filterButtonActive : ''
                }`}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>

          {/* Routes Grid */}
          <div className={styles.routesGrid}>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map(route => (
                <Link key={route.id} href={`/route/${route.id}`}>
                  <div className={`${styles.routeCard} ${route.isCompleted ? styles.completedRoute : ''}`}>
                    {route.isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Completed
                      </div>
                    )}
                    <div className={styles.routeImage}>
                      <Image
                        src="/WithoutName.png"
                        alt={route.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.routeContent}>
                      <h3 className={styles.routeName}>{route.name}</h3>
                      <p className={styles.routeDescription}>{route.description}</p>
                      <div className={styles.routeStats}>
                        <span className={styles.routeStat}>
                          📏 {route.distance}
                        </span>
                        <span className={styles.routeStat}>
                          ⏱️ {route.duration}
                        </span>
                        <span className={styles.routeStat}>
                          🍺 1 pub
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🗺️</div>
                <h3 className={styles.emptyStateTitle}>No routes found</h3>
                <p className={styles.emptyStateDescription}>
                  {routes.length === 0 
                    ? "Loading routes from database..." 
                    : "Try adjusting your search or filters to find more routes."}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .completedRoute {
          border: 2px solid green !important;
          position: relative;
        }
      `}</style>
    </div>
  );
}
