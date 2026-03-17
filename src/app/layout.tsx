import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: {
    default: "Will's Walks - Your Next Pub Walk Adventure",
    template: "%s | Will's Walks"
  },
  description: "Explore a growing collection of UK routes centred around a good pub, inspired by National Trust pub walks and expanded over time with new favourites. Each route includes the essentials at a glance: distance, estimated time, start point, and simple notes to help you plan.",
  keywords: ['walking', 'hiking', 'pubs', 'routes', 'countryside', 'UK'],
  authors: [{ name: "Nat Stephenson" }],
  creator: "Nat Stephenson",
  publisher: "Will's Walks",
  metadataBase: new URL('https://willswalks.netlify.app/'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://willswalks.netlify.app/',
    siteName: "Will's Walks",
    title: "Will's Walks - Your Next Pub Walk Adventure",
    description: "Explore a growing collection of UK routes centred around a good pub, inspired by National Trust pub walks and expanded over time with new favourites. Each route includes the essentials at a glance: distance, estimated time, start point, and simple notes to help you plan.",
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          {/* Background Pattern */}
          <div className={styles.backgroundPattern} />
          
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              {/* Logo */}
              <Link href="/" className={styles.logo}>
                <Image
                  src="/WithoutName.png"
                  alt="Will's Walks"
                  width={200}
                  height={50}
                  priority
                  className={styles.navbarLogo}
                />
              </Link>
                
              {/* Navigation */}
              <Navigation />
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}