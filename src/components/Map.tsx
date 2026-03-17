"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Route } from '@/types';

// Import navigation icons
import PintBeerIcon from '@/assets/PintBeer.png';

// Simple pub icon using the imported image
const pubIcon = new L.Icon({
  iconUrl: PintBeerIcon.src,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

// Fix default marker icon issue in Leaflet + Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Position {
  lat: number;
  lng: number;
}

interface MapProps {
  routes?: Route[];
  showCompletedOnly?: boolean;
  selectedRoute?: string | null;
}

export default function Map({ routes = [], showCompletedOnly = false, selectedRoute = null }: MapProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Filter routes based on props
  const displayRoutes = routes.filter(route => {
    if (selectedRoute && route.id !== selectedRoute) return false;
    if (showCompletedOnly && !route.isCompleted) return false;
    return true;
  });

  // Debug logging
  useEffect(() => {
    console.log('Map component props:', { routes: routes.length, showCompletedOnly, selectedRoute });
    console.log('Display routes:', displayRoutes.length);
  }, [routes, showCompletedOnly, selectedRoute, displayRoutes.length]);

  // Calculate center point for map view
  const getMapCenter = (): Position => {
    if (position) return position;
    if (displayRoutes.length > 0) {
      const avgLat = displayRoutes.reduce((sum, route) => sum + route.startPoint.lat, 0) / displayRoutes.length;
      const avgLng = displayRoutes.reduce((sum, route) => sum + route.startPoint.lng, 0) / displayRoutes.length;
      return { lat: avgLat, lng: avgLng };
    }
    // Default to UK center
    return { lat: 54.5, lng: -2.0 };
  };

  // Get GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    }
  }, []);

  const mapCenter = getMapCenter();
  const zoomLevel = displayRoutes.length > 0 ? 8 : 6;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Show user position if available */}
        {position && (
          <Marker position={position}>
            <Popup>
              <strong>📍 You are here</strong><br/>
              Current location
            </Popup>
          </Marker>
        )}
        
        {/* Render routes */}
        {displayRoutes.map(route => {
          const routePath = [
            [route.startPoint.lat, route.startPoint.lng] as [number, number],
            [route.endPoint.lat, route.endPoint.lng] as [number, number]
          ];
          
          const routeColor = route.isCompleted ? '#22c55e' : '#94a3b8';
          
          return (
            <React.Fragment key={route.id}>
              {/* Route path */}
              <Polyline
                positions={routePath}
                pathOptions={{
                  color: routeColor,
                  weight: 4,
                  opacity: 0.8,
                  dashArray: route.isCompleted ? undefined : '10, 10'
                }}
              >
                <Popup>
                  <strong>{route.name}</strong><br/>
                  {route.distance} miles • {route.duration}h • {route.difficulty}<br/>
                  Status: {route.isCompleted ? '✅ Completed' : '⏳ Pending'}
                </Popup>
              </Polyline>
              
              {/* Start marker */}
              <Marker position={[route.startPoint.lat, route.startPoint.lng]}>
                <Popup>
                  <strong>🚩 Start: {route.startPoint.name}</strong><br/>
                  Route: {route.name}<br/>
                  Distance: {route.distance} miles<br/>
                  Duration: {route.duration}h<br/>
                  Difficulty: {route.difficulty}
                </Popup>
              </Marker>
              
              {/* End marker */}
              <Marker position={[route.endPoint.lat, route.endPoint.lng]}>
                <Popup>
                  <strong>🏁 End: {route.endPoint.name}</strong><br/>
                  Route: {route.name}<br/>
                  Status: {route.isCompleted ? 'Completed ✅' : 'Pending ⏳'}
                </Popup>
              </Marker>
              
              {/* Pub markers */}
              {route.pubs.map(pub => (
                <Marker 
                  key={pub.id} 
                  position={[pub.latitude, pub.longitude]} 
                  icon={pubIcon}
                >
                  <Popup>
                    <strong>🍺 {pub.name}</strong><br/>
                    {pub.description}<br/>
                    <em>On route: {route.name}</em>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      {/* Map Legend - only show if routes are displayed */}
      {displayRoutes.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid #d1d5db',
          fontSize: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Legend</div>
          {position && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
              <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="Location" style={{ width: '12px', height: '19px' }} />
              <span>Your Location</span>
            </div>
          )}
          {displayRoutes.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="Start" style={{ width: '12px', height: '19px' }} />
                <span>Start Points</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="End" style={{ width: '12px', height: '19px' }} />
                <span>End Points</span>
              </div>
            </>
          )}
          {displayRoutes.some(route => route.pubs.length > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
              <img src={PintBeerIcon.src} alt="Pub" style={{ width: '16px', height: '16px' }} />
              <span>Pubs</span>
            </div>
          )}
          {displayRoutes.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '20px', height: '3px', backgroundColor: '#22c55e' }}></div>
                <span>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '20px', height: '3px', backgroundColor: '#94a3b8', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, white 5px, white 10px)' }}></div>
                <span>Pending</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
