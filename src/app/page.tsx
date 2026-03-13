'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { routes, getRoutesByRegion, searchRoutes } from '@/data/mockData';
import { formatDistance, formatDuration } from '@/utils';
import type { Route } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Get available regions from routes
  const regions = ['all', ...Array.from(new Set(routes.map(route => route.region)))];

  // Filter routes based on search and region
  const getFilteredRoutes = (): Route[] => {
    let filteredRoutes = routes;

    // Filter by region
    if (selectedRegion !== 'all') {
      filteredRoutes = getRoutesByRegion(selectedRegion);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filteredRoutes = searchRoutes(searchTerm);
      
      // Apply region filter to search results if needed
      if (selectedRegion !== 'all') {
        filteredRoutes = filteredRoutes.filter(route => 
          route.region.toLowerCase() === selectedRegion.toLowerCase()
        );
      }
    }

    return filteredRoutes;
  };

  const filteredRoutes = getFilteredRoutes();

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/LogoWithName.png"
            alt="Will's Walks"
            width={300}
            height={75}
            priority
            className={styles.mainLogo}
          />
        </div>
        <h2 className={styles.title}>Discover Walking Routes</h2>
        <p className={styles.subtitle}>Explore curated walks and pub routes across the UK</p>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div style={{ position: 'relative' }}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Filter */}
      <div className={styles.filterContainer}>
        <span>🔽</span>
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`${styles.filterButton} ${
              selectedRegion === region ? styles.filterButtonActive : ''
            }`}
          >
            {region === 'all' ? 'All Regions' : region}
          </button>
        ))}
      </div>

      {/* Routes Grid */}
      <div className={styles.routesGrid}>
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <div className={styles.routeCard}>
                <div className={styles.routeImage}>
                  <Image
                    src="/WithoutName.png"
                    alt={route.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.routeContent}>
                  <h3 className={styles.routeName}>{route.name}</h3>
                  <p className={styles.routeDescription}>{route.description}</p>
                  <div className={styles.routeStats}>
                    <span className={styles.routeStat}>
                      📏 {formatDistance(route.distance)}
                    </span>
                    <span className={styles.routeStat}>
                      ⏱️ {formatDuration(route.duration)}
                    </span>
                    <span className={styles.routeStat}>
                      🍺 {route.pubs.length} pubs
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🗺️</div>
            <h3 className={styles.emptyStateTitle}>No routes found</h3>
            <p className={styles.emptyStateDescription}>
              {routes.length === 0 
                ? "Get started by creating your first walking route!" 
                : "Try adjusting your search or filters to find more routes."}
            </p>
            <Link href="/create" className="btn-primary">
              Create Your First Route
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}