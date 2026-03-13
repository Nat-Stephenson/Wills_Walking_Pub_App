import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: {
    default: "Will's Walks - Your hiking companion",
    template: "%s | Will's Walks"
  },
  description: "Discover and create pub walking routes across beautiful British countryside",
  keywords: ['walking', 'hiking', 'pubs', 'routes', 'countryside', 'UK'],
  authors: [{ name: "Will's Walks" }],
  creator: "Will's Walks",
  publisher: "Will's Walks",
  metadataBase: new URL('https://willswalks.com'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://willswalks.com',
    siteName: "Will's Walks",
    title: "Will's Walks - Your hiking companion",
    description: "Discover and create pub walking routes across beautiful British countryside",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Will's Walks - Your hiking companion",
    description: "Discover and create pub walking routes across beautiful British countryside",
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