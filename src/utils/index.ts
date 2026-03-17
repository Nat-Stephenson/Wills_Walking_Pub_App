// Utility functions for the Will's Walks app

import type { Route } from '@/types';

/**
 * Format distance in miles to a readable string
 */
export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} miles`;
};

/**
 * Format duration in minutes to hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
};

/**
 * Get difficulty badge color class
 */
export const getDifficultyColor = (difficulty: Route['difficulty']): string => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-800 bg-green-100';
    case 'Moderate': 
      return 'text-amber-800 bg-amber-100';
    case 'Challenging':
      return 'text-red-800 bg-red-100';
    default:
      return 'text-gray-800 bg-gray-100';
  }
};

/**
 * Calculate estimated calories burned based on distance and difficulty
 */
export const estimateCalories = (distance: number, difficulty: Route['difficulty']): number => {
  const baseCaloriesPerMile = 80; // Base calories per mile
  const difficultyMultiplier = {
    'Easy': 1.0,
    'Moderate': 1.3,
    'Challenging': 1.6,
  };
  
  return Math.round(distance * baseCaloriesPerMile * difficultyMultiplier[difficulty]);
};

/**
 * Generate a URL slug from a route name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Check if a route is bookmarkable/saveable
 */
export const canBookmark = (route: Route): boolean => {
  return route.pubs.length > 0 && route.distance > 0;
};

/**
 * Get a random route recommendation
 */
export const getRandomRoute = (routes: Route[], excludeId?: string): Route | null => {
  const availableRoutes = routes.filter(route => route.id !== excludeId);
  if (availableRoutes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableRoutes.length);
  return availableRoutes[randomIndex];
};

/**
 * Format coordinates to a readable string
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

/**
 * Calculate straight-line distance between two points (in miles)
 */
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};