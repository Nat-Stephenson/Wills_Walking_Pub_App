'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { routes } from '@/data/mockData';

// Map component that renders the actual Google Map
function MapComponent({ center, zoom, routes }: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  routes: Array<{
    id: string;
    name: string;
    startPoint: { name: string; lat: number; lng: number };
    endPoint: { name: string; lat: number; lng: number };
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    isCompleted: boolean;
  }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  // Add markers when map is ready
  useEffect(() => {
    if (map) {
      // Clear existing markers
      // Add route markers
      routes.forEach((route) => {
        // Start point marker
        const startMarker = new window.google.maps.Marker({
          position: { lat: route.startPoint.lat, lng: route.startPoint.lng },
          map,
          title: `${route.name} - Start: ${route.startPoint.name}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: route.isCompleted ? '#22c55e' : '#92400e',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        // End point marker
        const endMarker = new window.google.maps.Marker({
          position: { lat: route.endPoint.lat, lng: route.endPoint.lng },
          map,
          title: `${route.name} - End: ${route.endPoint.name}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: route.isCompleted ? '#16a34a' : '#78350f',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        // Info windows
        const startInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; color: #92400e;">${route.name}</h3>
              <p style="margin: 0; font-weight: bold;">Start: ${route.startPoint.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">
                Difficulty: ${route.difficulty}
                ${route.isCompleted ? ' | ✅ Completed' : ''}
              </p>
            </div>
          `,
        });

        const endInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; color: #92400e;">${route.name}</h3>
              <p style="margin: 0; font-weight: bold;">End: ${route.endPoint.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">
                Difficulty: ${route.difficulty}
                ${route.isCompleted ? ' | ✅ Completed' : ''}
              </p>
            </div>
          `,
        });

        startMarker.addListener('click', () => {
          endInfoWindow.close();
          startInfoWindow.open(map, startMarker);
        });

        endMarker.addListener('click', () => {
          startInfoWindow.close();
          endInfoWindow.open(map, endMarker);
        });
      });
    }
  }, [map, routes]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

// Loading component
const renderStatus = (status: Status): ReactElement => {
  if (status === Status.LOADING) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        minHeight: '500px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <p>Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  if (status === Status.FAILURE) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        minHeight: '500px',
        background: '#fee2e2',
        color: '#dc2626'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h3>Failed to Load Google Maps</h3>
          <p>Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  return <></>;
};

// Main GoogleMap component
interface GoogleMapProps {
  apiKey: string;
  showAllRoutes?: boolean;
}

export default function GoogleMap({ apiKey, showAllRoutes = false }: GoogleMapProps) {
  const [filteredRoutes] = useState(() => {
    return showAllRoutes ? routes : routes.filter(route => route.isCompleted);
  });

  // Center map on UK
  const center = { lat: 53.8, lng: -1.5 };
  const zoom = 6;

  if (!apiKey) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        minHeight: '500px',
        background: '#fef3c7',
        color: '#92400e'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
          <h3>Google Maps API Key Required</h3>
          <p>Please add your Google Maps API key to use this feature</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={renderStatus}>
      <MapComponent center={center} zoom={zoom} routes={filteredRoutes} />
    </Wrapper>
  );
}