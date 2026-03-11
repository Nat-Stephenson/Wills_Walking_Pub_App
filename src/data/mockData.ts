import type { Route, Pub } from '@/types';

// Sample routes for development/testing
export const routes: Route[] = [
  {
    id: '1',
    name: 'The Cotswolds Circular',
    description: 'A beautiful walk through the heart of the Cotswolds, passing through charming villages and rolling hills.',
    distance: 12.5,
    duration: 4.5,
    difficulty: 'Moderate',
    region: 'Cotswolds',
    imageUrl: undefined,
    isCompleted: false,
    startPoint: {
      name: 'Chipping Campden',
      lat: 52.0415,
      lng: -1.7799
    },
    endPoint: {
      name: 'Broadway',
      lat: 52.0343,
      lng: -1.8575
    },
    pubs: [
      {
        id: 'pub-1',
        name: 'The King\'s Head',
        description: 'Historic 16th-century inn with traditional ales',
        latitude: 52.0395,
        longitude: -1.7810
      }
    ]
  },
  {
    id: '2',
    name: 'Peak District Moorland Trek',
    description: 'Challenge yourself with this rugged moorland walk featuring stunning views across the Dark Peak.',
    distance: 18.2,
    duration: 6.0,
    difficulty: 'Challenging',
    region: 'Peak District',
    imageUrl: undefined,
    isCompleted: true,
    startPoint: {
      name: 'Edale',
      lat: 53.3667,
      lng: -1.8167
    },
    endPoint: {
      name: 'Hayfield',
      lat: 53.3833,
      lng: -1.9167
    },
    pubs: [
      {
        id: 'pub-2',
        name: 'The Old Nag\'s Head',
        description: 'Traditional walkers\' pub at the start of the Pennine Way',
        latitude: 53.3670,
        longitude: -1.8170
      }
    ]
  },
  {
    id: '3',
    name: 'Lake District Valley Walk',
    description: 'Gentle valley walk through some of the Lake District\'s most beautiful scenery.',
    distance: 8.0,
    duration: 2.5,
    difficulty: 'Easy',
    region: 'Lake District',
    imageUrl: undefined,
    isCompleted: false,
    startPoint: {
      name: 'Grasmere',
      lat: 54.4594,
      lng: -3.0297
    },
    endPoint: {
      name: 'Ambleside',
      lat: 54.4306,
      lng: -2.9639
    },
    pubs: [
      {
        id: 'pub-3',
        name: 'The Dove Cottage Inn',
        description: 'Cozy inn near Wordsworth\'s former home',
        latitude: 54.4600,
        longitude: -3.0300
      }
    ]
  }
];

// Helper functions
export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

export const getRoutesByRegion = (region: string): Route[] => {
  if (region === 'all') {
    return routes;
  }
  return routes.filter(route => route.region === region);
};

export const getRoutesByDifficulty = (difficulty: Route['difficulty']): Route[] => {
  return routes.filter(route => route.difficulty === difficulty);
};

export const searchRoutes = (searchTerm: string): Route[] => {
  const lowerSearch = searchTerm.toLowerCase();
  return routes.filter(route =>
    route.name.toLowerCase().includes(lowerSearch) ||
    route.description.toLowerCase().includes(lowerSearch) ||
    route.region.toLowerCase().includes(lowerSearch)
  );
};

export const getCompletedRoutes = (): Route[] => {
  return routes.filter(route => route.isCompleted);
};

export const getAvailableRegions = (): string[] => {
  return Array.from(new Set(routes.map(route => route.region)));
};

// Constants
export const DIFFICULTY_LEVELS: Route['difficulty'][] = ['Easy', 'Moderate', 'Challenging'];

export const DIFFICULTY_COLORS = {
  Easy: '#10b981',      // green
  Moderate: '#f59e0b',  // amber  
  Challenging: '#ef4444' // red
} as const;