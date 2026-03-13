// Application constants

import type { Route, NavItem } from '@/types';

// Import images
import TreeIcon from '@/assets/Tree.png';
import PintBeerIcon from '@/assets/PintBeer.png';
import TrekIcon from '@/assets/Trek.png';
import MapIcon from '@/assets/Map.png';

// Navigation items
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Routes', icon: TreeIcon },
  { path: '/create', label: 'Create', icon: PintBeerIcon },
  { path: '/my-walks', label: 'My Walks', icon: TrekIcon },
  { path: '/map', label: 'Map', icon: MapIcon },
];

// Difficulty levels and their properties
export const DIFFICULTIES: Route['difficulty'][] = ['Easy', 'Moderate', 'Challenging'];

export const DIFFICULTY_CONFIG = {
  Easy: {
    color: 'bg-green-100 text-green-800',
    description: 'Suitable for beginners and families',
    icon: '🚶',
  },
  Moderate: {
    color: 'bg-amber-100 text-amber-800', 
    description: 'Some walking experience recommended',
    icon: '🥾',
  },
  Challenging: {
    color: 'bg-red-100 text-red-800',
    description: 'For experienced hikers only',
    icon: '⛰️',
  },
} as const;

// App metadata
export const APP_CONFIG = {
  name: "Will's Walks",
  description: 'Discover and create pub walking routes across beautiful British countryside',
  url: 'https://willswalks.com',
  author: "Will's Walks Team",
  keywords: ['walking', 'hiking', 'pubs', 'routes', 'countryside', 'UK', 'England'],
} as const;

// Search and filter options
export const SEARCH_FILTERS = {
  regions: ['all', 'Cotswolds', 'Lake District', 'Peak District', 'Yorkshire Dales', 'Devon', 'Cornwall'],
  difficulties: ['all', ...DIFFICULTIES],
  distances: [
    { label: 'All distances', value: 'all' },
    { label: 'Short walks (< 5km)', value: 'short', max: 5 },  
    { label: 'Medium walks (5-10km)', value: 'medium', min: 5, max: 10 },
    { label: 'Long walks (> 10km)', value: 'long', min: 10 },
  ],
  durations: [
    { label: 'All durations', value: 'all' },
    { label: 'Quick walks (< 2hrs)', value: 'quick', max: 120 },
    { label: 'Half day walks (2-4hrs)', value: 'half-day', min: 120, max: 240 },
    { label: 'Full day walks (> 4hrs)', value: 'full-day', min: 240 },
  ],
} as const;

// Form validation constants
export const VALIDATION = {
  route: {
    name: {
      minLength: 3,
      maxLength: 100,
    },
    description: {
      minLength: 10,
      maxLength: 500, 
    },
    distance: {
      min: 0.1,
      max: 50,
    },
    duration: {
      min: 5,
      max: 600, // 10 hours
    },
  },
  pub: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    description: {
      maxLength: 200,
    },
    coordinates: {
      lat: { min: 49, max: 61 }, // Approximate UK bounds
      lng: { min: -8, max: 2 },
    },
  },
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  routes: '/api/routes',
  pubs: '/api/pubs', 
  search: '/api/search',
  user: '/api/user',
} as const;

// Storage keys for localStorage
export const STORAGE_KEYS = {
  userPreferences: 'ww_user_prefs',
  completedRoutes: 'ww_completed',
  bookmarkedRoutes: 'ww_bookmarked',
  searchHistory: 'ww_search_history',
} as const;