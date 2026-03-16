// Global type definitions
import { StaticImageData } from 'next/image';

export interface Route {
  id: string;
  name: string;
  description: string;
  distance: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  region: string;
  imageUrl?: string;
  isCompleted: boolean;
  pubs: Pub[];
  historicalFacts?: string[];
  startPoint: {
    name: string;
    lat: number;
    lng: number;
  };
  endPoint: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface Pub {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
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
}

export interface PubFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
}