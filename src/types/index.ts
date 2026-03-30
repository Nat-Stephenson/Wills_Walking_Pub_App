// Global type definitions
import { StaticImageData } from 'next/image';

export interface Route {
  id: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  region: string;
  imageUrl?: string;
  isCompleted: boolean;
  historicalFacts?: string[];
  // Database coordinate fields
  start_latitude: number;
  start_longitude: number;
  pub_latitude: number;
  pub_longitude: number;
  end_latitude: number;
  end_longitude: number;
  pub_name: string;
}

export interface Pub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon: StaticImageData;
}

export interface CreateRouteFormData {
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  region: string;
  historicalFacts?: string[];
  startPoint: {
    name: string;
    latitude: string;
    longitude: string;
  };
  endPoint: { 
    name: string;
    latitude: string;
    longitude: string;        
    };  
}

export interface PubFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
}