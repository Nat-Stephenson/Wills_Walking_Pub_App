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
    historicalFacts: [
      'Chipping Campden was once one of the wealthiest wool trading towns in England during the 14th century',
      'The route passes St. James\' Church, which houses the only remaining medieval altar hanging in England',
      'Broadway Tower was built in 1798 as a folly and is said to be inspired by the legend of Lady Coventry',
      'The ancient Ridgeway path you walk on has been in use for over 5,000 years',
      'Look out for the mysterious "Dover\'s Hill" - site of the historic Cotswold Olimpick Games since 1612'
    ],
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
    historicalFacts: [
      'This route follows part of the historic Pennine Way, Britain\'s first National Trail opened in 1965',
      'Edale was the site of the famous 1932 Mass Trespass that led to the creation of National Parks',
      'The moorland is home to the legend of the "Barghest" - a monstrous black dog said to roam these hills',
      'Ancient stone circles and burial mounds dot the landscape, some dating back 4,000 years',
      'The route passes near Kinder Scout, where the "Right to Roam" movement began',
      'Look for the remains of medieval settlements abandoned during the Black Death'
    ],
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
    historicalFacts: [
      'Grasmere was home to William Wordsworth from 1799-1808, inspiring much of his famous poetry',
      'The village church contains Wordsworth\'s grave, marked by a simple headstone of local slate',
      'Ancient Celtic legends speak of water spirits dwelling in these lakes',
      'The route passes Dove Cottage, where Wordsworth wrote "I Wandered Lonely as a Cloud"',
      'The area inspired the creation of the National Trust in 1895 by Beatrix Potter and others',
      'Look for the traditional Lakeland dry stone walls built without mortar, some over 400 years old'
    ],
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