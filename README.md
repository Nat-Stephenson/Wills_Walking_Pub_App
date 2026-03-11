# Will's Walks - Streamlined Next.js App

A modern, clean Next.js application for discovering and creating pub walking routes across the UK countryside.

## 🚀 Updated Structure

The app has been streamlined to follow Next.js 15 best practices:

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

## 🗄️ Database Integration

### Current State
- **Mock data removed** - All sample routes and pubs have been cleaned out
- **Service layer ready** - Database connection points are prepared in `/src/services/`
- **Types defined** - All TypeScript interfaces are ready for your data structure

### To Connect Your Database

1. **Install your database driver** (examples):
```bash
# For MongoDB with Mongoose
npm install mongoose

# For PostgreSQL with Prisma
npm install prisma @prisma/client

# For Supabase
npm install @supabase/supabase-js
```

2. **Update the service files** in `/src/services/index.ts`:
```typescript
// Replace the TODO comments with your database calls
static async getAllRoutes(): Promise<Route[]> {
  // MongoDB example:
  return await RouteModel.find({}).populate('pubs');
  
  // Prisma example:
  return await prisma.route.findMany({ include: { pubs: true } });
  
  // Supabase example:
  const { data } = await supabase.from('routes').select('*, pubs(*)');
  return data || [];
}
```

3. **Environment variables** (create `.env.local`):
```
# Database connection
DATABASE_URL=your_database_connection_string
# Add other environment variables as needed
```

## 🛠️ Development

### Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Adding New Features

1. **New page**: Create in `/src/app/[name]/page.tsx`
2. **New component**: Add to `/src/components/` with `.module.css`
3. **New API route**: Create in `/src/app/api/[name]/route.ts`
4. **New types**: Add to `/src/types/index.ts`
5. **New utilities**: Add to `/src/utils/index.ts`

## 🎯 Next Steps

1. **Connect your database** using the service layer
2. **Add user authentication** (NextAuth.js recommended)
3. **Implement API routes** for data operations
4. **Add map functionality** (Leaflet/Mapbox)
5. **Deploy to Vercel** for optimal Next.js hosting

## 🔄 What Changed

- ✅ **Removed all mock data** - Clean slate for your database
- ✅ **Added proper TypeScript types** - Better development experience
- ✅ **Organized CSS architecture** - Maintainable styles
- ✅ **Updated Next.js configuration** - Modern best practices
- ✅ **Added service layer** - Ready for database connections
- ✅ **Improved component structure** - Better separation of concerns
- ✅ **Added empty states** - Better user experience
- ✅ **Modern development setup** - Path aliases, strict typing

## 📝 Database Schema Recommendations

Based on the existing types, your database should have:

**Routes Table:**
- `id` (string/UUID, primary key)
- `name` (string)  
- `description` (text)
- `distance` (number/decimal)
- `duration` (number/integer, minutes)  
- `difficulty` (enum: 'Easy', 'Moderate', 'Challenging')
- `region` (string)
- `imageUrl` (string, optional)
- `isCompleted` (boolean)
- `startPoint` (JSON/object with name, lat, lng)
- `endPoint` (JSON/object with name, lat, lng)

**Pubs Table:**
- `id` (string/UUID, primary key)
- `name` (string)
- `description` (text)
- `latitude` (decimal)
- `longitude` (decimal)
- `routeId` (foreign key to Routes)

The app is now ready for your database integration! 🚀
