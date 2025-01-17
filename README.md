# Fetch Frontend Take-Home Assessment

## Live Demo

The application is deployed and accessible at: [https://fetch-take-home-seven.vercel.app/](https://fetch-take-home-seven.vercel.app/)

## Overview

This project is a modern web application built to help users search through and find adoptable dogs from a shelter database. It features a robust search interface with filtering, sorting, and favoriting capabilities, along with a matching system to help users find their perfect companion.

## Key Features

- User authentication with name and email
- Advanced dog search functionality with multiple filters
- Interactive map-based location selection
- Breed filtering with searchable dropdown
- Age range filtering
- Pagination of search results
- Customizable sorting (breed A-Z/Z-A)
- Favorites management with persistent storage
- Dog matching algorithm integration
- Responsive design with dark/light mode support
- Animated Landing page with Lottie dog animation
- Animated UI transitions and loading states
- Intelligent Matchmaker system with:
  - Location-based matching within 50-mile radius
  - Breed preference selection
  - Age range filtering
  - Automatic ZIP code resolution using zippopotam.us
  - Multi-step matching process

## Technology Stack

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn with custom styling
- **Authentication**: Custom implementation with HTTP-only cookies

### Key Dependencies

- `@tanstack/react-query` - For data fetching and cache management
- `next-themes` - Theme management (dark/light mode)
- `framer-motion` - Animations and transitions
- `leaflet` & `react-leaflet` - Interactive map functionality
- `react-hook-form` - Form handling and validation
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `lottie-react` - Lottie animation rendering
- `vaul` - Mobile drawer and bottom sheet interactions
- `class-variance-authority` - Component variant management
- `tailwind-merge` - Tailwind class merging utilities

## Project Structure

```
src/
├── animations/        # Lottie and Framer Motion animations
├── app/               # Next.js app router pages
│   ├── (main)/        # Main application pages
│   ├── (auth)/        # Authentication related routes
│   ├── api/           # API route handlers
│   ├── layout/        # Root layout
│   └── page/          # Landing page
├── components/        # React components
│   └── ui/            # Reusable UI components (shadcn)
├── context/           # React context providers
├── hooks/             # Custom React hooks
└── lib/               # Utility functions, types and configurations
```

### Key Components

- Landing - Animated landing page
- DogsList - Main search results display
- Search - Search interface with filters
- FavoritesList - Saved favorites management
- MatchedDog - Match result display
- DogCard - Individual dog display card
- Map - Location selection interface
- Matchmaker - Matchmaking user flow

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dmostoller/fetch-take-home

# Install dependencies
npm install --legacy-peer-deps #using React 19

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

No environment variables are required as the API endpoints are hardcoded to the assessment service URL.

## Architecture Decisions

### State Management

- Used React Query for server state management
- Local state handled with React's useState and Context API
- Persistent storage for favorites using localStorage

### Design System

- Shadcn UI components built on Radix UI primitives
- Consistent theming with CSS variables
- Responsive design using Tailwind breakpoints
- Dark/light mode support

### Performance Optimizations

- Image optimization with Next.js Image component
- Dynamic imports for heavy components (Map)
- Debounced search inputs
- Pagination for large result sets
- Skeleton loading states

## API Integration

The application integrates with multiple external services:

### Fetch Assessment API

- Authentication (/auth, /auth/check)
- Dog search and filtering (/dogs/search)
- Breed listing (/dogs/breeds)
- Dogs by Ids (/dogs/byIds)
- Location search (/locations/search)
- Dog matching (/dogs/match)
- Matchmaker (/matchmaker/)

### Zippopotam.us API

- Geographic coordinate resolution
- Distance-based ZIP code search within 50-mile radius

## Additional Features

- Lottie animations for engaging visual elements
- Framer Motion for smooth UI transitions
- Interactive map for location selection
- Skeleton loading states
- Toast notifications for user feedback
- Responsive design for mobile devices
- Persistent favorites across sessions
- Accessible UI components

## Developer Notes

- The project uses a custom theme system with both light and dark modes, with colors inspired by the Fetch Rewards brand.
- Components are built with accessibility in mind
- Error boundaries and loading states are implemented throughout
- Type safety is enforced with TypeScript
- Code formatting is handled by Prettier
- ESLint is configured for code quality
- Performance monitoring with Google Analytics and Vercel's Speed Insights and Analytics

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

## License

This project is created as part of a technical assessment for Fetch and is not licensed for public use.
