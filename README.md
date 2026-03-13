# Will's Walks: Next.js App

A simple Next.js application for discovering and creating pub walking routes across the UK countryside.

### 📁 Directory Structure
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page with proper types
│   ├── create/            # Route creation page
│   └── **/*.module.css    # Co-located styles
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Main navigation
│   └── *.module.css      # Component styles
├── constants/             # App constants and config
├── data/                  # Data layer (ready for database)
├── services/              # Data service layer
├── styles/                # Global styles (organized)
│   ├── globals.css       # Main entry point
│   ├── reset.css         # CSS reset
│   ├── typography.css    # Typography styles  
│   ├── utilities.css     # Utility classes
│   └── components.css    # Global component styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```
