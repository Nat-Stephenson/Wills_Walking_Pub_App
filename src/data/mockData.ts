import type { Route, Pub } from '@/types';

// Empty data arrays - replace with your database calls
export const routes: Route[] = [];

// Helper functions for data manipulation
export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

export const getRoutesByRegion = (region: string): Route[] => {
  if (region === 'all') return routes;
  return routes.filter(route => route.region.toLowerCase() === region.toLowerCase());
};

export const getRoutesByDifficulty = (difficulty: Route['difficulty']): Route[] => {
  return routes.filter(route => route.difficulty === difficulty);
};

export const searchRoutes = (searchTerm: string): Route[] => {
  const term = searchTerm.toLowerCase();
  return routes.filter(route => 
    route.name.toLowerCase().includes(term) ||
    route.description.toLowerCase().includes(term) ||
    route.region.toLowerCase().includes(term)
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
        description: 'Famous walkers pub',
        latitude: 53.3650,
        longitude: -1.8100
      },
      {
        id: 'p5',
        name: 'The Castle Inn',
        description: 'Historic inn near the castle',
        latitude: 53.3400,
        longitude: -1.7750
      }
    ]
  }
];