'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Route } from '@/types';
import type { User } from '@supabase/supabase-js';

export default function RouteDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [completedDate, setCompletedDate] = useState<Date | null>(null);

  // Load route data and check auth status
  useEffect(() => {
    loadRouteData();
    checkAuthStatus();
  }, [id]);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    if (session?.user && id) {
      checkUserCompletion(session.user.id, id);
    }
  };

  const loadRouteData = async () => {
    try {
      setLoading(true);
      
      const { data: routeData, error } = await supabase
        .from('walking_routes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading route:', error);
        return;
      }

      // Calculate distance: start → pub → end
      const toRad = (value: number) => value * Math.PI / 180;
      
      // Distance from start to pub
      const lat1 = toRad(routeData.start_latitude);
      const lat2 = toRad(routeData.pub_latitude);
      const deltaLat1 = toRad(routeData.pub_latitude - routeData.start_latitude);
      const deltaLng1 = toRad(routeData.pub_longitude - routeData.start_longitude);
      
      const a1 = Math.sin(deltaLat1/2) * Math.sin(deltaLat1/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng1/2) * Math.sin(deltaLng1/2);
      const c1 = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1-a1));
      const startToPub = 6371 * c1;
      
      // Distance from pub to end
      const lat3 = toRad(routeData.pub_latitude);
      const lat4 = toRad(routeData.end_latitude);
      const deltaLat2 = toRad(routeData.end_latitude - routeData.pub_latitude);
      const deltaLng2 = toRad(routeData.end_longitude - routeData.pub_longitude);
      
      const a2 = Math.sin(deltaLat2/2) * Math.sin(deltaLat2/2) +
              Math.cos(lat3) * Math.cos(lat4) *
              Math.sin(deltaLng2/2) * Math.sin(deltaLng2/2);
      const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1-a2));
      const pubToEnd = 6371 * c2;
      
      // Total walking distance
      const totalDistanceKm = startToPub + pubToEnd;
      
      // Average walking speed: 4 km/h, add 30 minutes for pub stop
      const walkingTimeHours = (totalDistanceKm / 4) + 0.5;
      
      // Format duration
      const hours = Math.floor(walkingTimeHours);
      const minutes = Math.round((walkingTimeHours - hours) * 60);
      const duration = hours > 0 
        ? (minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`)
        : `${minutes} min`;
      
      const distanceFormatted = totalDistanceKm > 0 
        ? `${totalDistanceKm.toFixed(1)} km`
        : '5 km'; // Default for circular routes

      // Transform data to match Route type
      const transformedRoute: Route = {
        id: routeData.id,
        name: routeData.route_name,
        description: routeData.historical_fact,
        distance: distanceFormatted,
        duration: duration,
        difficulty: 'Moderate' as 'Easy' | 'Moderate' | 'Challenging',
        region: 'UK', // Default
        imageUrl: '/placeholder.jpg', // Default
        isCompleted: false,
        historicalFacts: [routeData.historical_fact],
        // Direct coordinate fields from database
        start_latitude: routeData.start_latitude || 0,
        start_longitude: routeData.start_longitude || 0,
        pub_latitude: routeData.pub_latitude || 0,
        pub_longitude: routeData.pub_longitude || 0,
        end_latitude: routeData.end_latitude || 0,
        end_longitude: routeData.end_longitude || 0,
        pub_name: routeData.pub_name || 'Unknown Pub'
      };

      setRoute(transformedRoute);
    } catch (error) {
      console.error('Error loading route:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserCompletion = async (userId: string, routeId: string) => {
    const { data, error } = await supabase
      .from('user_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('route_id', routeId)
      .single();

    if (!error && data) {
      setIsCompleted(true);
      setCompletedDate(new Date(data.completed_at));
    }
  };

  const toggleCompleted = async () => {
    if (!user) {
      alert('Please sign in to mark routes as completed');
      return;
    }

    setCompletionLoading(true);
    
    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('user_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('route_id', id);

        if (!error) {
          setIsCompleted(false);
          setCompletedDate(null);
        }
      } else {
        // Add completion
        const { error } = await supabase
          .from('user_completions')
          .insert([
            {
              user_id: user.id,
              route_id: id,
              completed_at: new Date().toISOString()
            }
          ]);

        if (!error) {
          setIsCompleted(true);
          setCompletedDate(new Date());
        }
      }
    } catch (error) {
      console.error('Error updating completion status:', error);
      alert('Failed to update completion status');
    } finally {
      setCompletionLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #92400e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading route details...</p>
      </div>
    );
  }

  // Route not found
  if (!route) {
    return (
      <div className="container">
        <h1>Route not found</h1>
        <button onClick={() => router.back()}>← Back to routes</button>
      </div>
    );
  }

  const difficultyColors = {
    'Easy': { background: '#dcfce7', color: '#15803d' },
    'Moderate': { background: '#fef3c7', color: '#b45309' },
    'Challenging': { background: '#fee2e2', color: '#dc2626' }
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

        {/* Completion Status */}
        {user && isCompleted && completedDate && (
          <div style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ✅ You completed this route on {completedDate.toLocaleDateString()}
          </div>
        )}

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
              {route.distance}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Distance</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⏱️</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e' }}>
              {route.duration}
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
              1
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pub</div>
          </div>
        </div>

        {/* Completion Toggle */}
        <div style={{ textAlign: 'center' }}>
          {user ? (
            <button
              onClick={toggleCompleted}
              disabled={completionLoading}
              className="btn-primary"
              style={{
                background: isCompleted ? '#22c55e' : '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                opacity: completionLoading ? 0.7 : 1
              }}
            >
              {completionLoading ? '⏳' : (isCompleted ? '✅' : '⭕')} 
              {completionLoading 
                ? 'Updating...'
                : (isCompleted ? 'Mark as Incomplete' : 'Mark as Completed')
              }
            </button>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '0.5rem',
              color: '#64748b'
            }}>
              <p>Sign in to track your progress and mark routes as completed</p>
            </div>
          )}
        </div>
      </div>

      {/* View on Map Link */}
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/map')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🗺️ View All Routes on Map
        </button>
        <div style={{ 
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          See this route with GPS tracking and route planning
        </div>
      </div>

      {/* Historical Fact */}
      {route.historicalFacts && route.historicalFacts[0] && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            📜 Historical Fact
          </h2>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            {route.historicalFacts[0]}
          </p>
        </div>
      )}

      {/* Pub Information */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          🍺 Pub Stop
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>🍺</div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {route.pub_name}
            </h3>
            <p style={{ color: '#64748b' }}>
              Perfect spot for a refreshment break during your walk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}