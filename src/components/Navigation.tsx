'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { NavItem } from '@/types';
import styles from './Navigation.module.css';

const navItems: NavItem[] = [
  { path: '/', label: 'Routes', icon: '🌲' },
  { path: '/create', label: 'Create', icon: '🍺' },
  { path: '/my-walks', label: 'My Walks', icon: '👢' },
  { path: '/map', label: 'Map', icon: '🗺️' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}