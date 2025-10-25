# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Student Well-being Management System - A full-stack MERN application that helps students improve their well-being through AI-powered personalized challenges, gamification, social features, and coach access.

## Development Commands

### Backend (Node.js/Express)
```powershell
cd backend
npm install                 # Install dependencies
npm run dev                 # Start development server (with nodemon)
npm start                   # Start production server
npm test                    # Run tests with Jest
```

Backend runs on http://localhost:5000

### Frontend (React/Vite)
```powershell
cd frontend
npm install                 # Install dependencies
npm run dev                 # Start development server
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # Run ESLint
```

Frontend runs on http://localhost:3000

### Testing Individual Features
- To test a specific backend route: use the route structure in `backend/routes/`
- No specific test runner configured for individual files - tests run in watch mode with Jest

## Architecture

### Backend Architecture

**Core Pattern**: RESTful API with Mongoose ODM for MongoDB

**Key Models** (all in `backend/models/`):
- **User.js**: Central model with authentication, profile, gamification (points, levels, badges, streaks), social features (friends, friendRequests), and AI personalization data (comfortZoneLevel, interests, wellbeingGoals)
- **Challenge.js**: Challenge definitions with AI criteria, difficulty levels, and review system
- **Progress.js**: Tracks user progress on challenges with status, milestones, and reflections
- **Message.js**: Messaging system for peer-to-peer and group communication
- **Coach.js**: Coach profiles with certifications, specializations, and client management

**Route Structure** (all in `backend/routes/`):
- `/api/users` - Authentication, profiles, friends, badges
- `/api/challenges` - Challenge CRUD, personalization, search, reviews
- `/api/progress` - Start/update/complete challenges, track milestones
- `/api/messaging` - Send messages, conversations, read status
- `/api/discovery` - User discovery, trending content, recommendations
- `/api/coaches` - Coach browsing and connection
- `/api/ai` - AI-powered suggestions, challenge generation, motivational messages, progress analysis

**Authentication**: JWT tokens with bcrypt password hashing. No middleware directory exists - authentication logic is directly in routes.

**Database Connection**: MongoDB Atlas with connection string in `.env`. Server crashes on connection failure.

### Frontend Architecture

**Framework**: React 18 with Vite as build tool

**State Management**:
- **AuthContext** (`src/context/AuthContext.jsx`): Manages authentication state, user data, and localStorage persistence
- React Hooks for local state

**Routing**: React Router v6 with protected routes pattern

**API Communication**: Centralized axios instance (`src/services/api.js`) with:
- Automatic JWT token injection via request interceptor
- 401 auto-logout via response interceptor
- Organized API modules: authAPI, userAPI, challengeAPI, progressAPI, messagingAPI, discoveryAPI, coachAPI, aiAPI

**Page Structure** (all in `src/pages/`):
- Home, Login, Register (public)
- ChallengesDashboard, ChallengeDetail (challenge browsing)
- UserProfile, ProgressTracker (user features)
- Messaging, CoachAccess, DiscoveryFeed (social features)

### Data Flow Patterns

1. **User Progress & Gamification**:
   - User completes challenge → Progress.status updated → User.totalPoints increased
   - Points drive level calculation (100 points per level)
   - Streak tracked via User.updateStreak() method (daily activity)
   - Badges stored directly in User.badges array

2. **AI Personalization**:
   - User profile contains comfortZoneLevel (1-10 scale)
   - AI routes analyze user's interests, goals, and challenge history
   - Gemini AI integration configured but uses placeholder functions in aiRoutes.js
   - AI generates: daily suggestions, custom challenges, motivational messages, progress insights

3. **Social Features**:
   - Friend requests stored in User.friendRequests with pending/accepted/rejected status
   - Friends array contains ObjectId references to other Users
   - Messages link sender and recipient, support attachments and reactions

## Environment Configuration

### Backend `.env` Requirements
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

### Frontend Environment Variables
Configure in `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Defaults to `http://localhost:5000/api` if not set. Vite proxy configured for `/api` routes.

## Key Implementation Details

### User Model Methods
- `comparePassword(candidatePassword)`: Async password validation with bcrypt
- `calculateLevel()`: Auto-calculates level based on totalPoints (100 points per level)
- `updateStreak()`: Tracks daily activity streaks, resets if >1 day gap

### Password Security
User schema has pre-save hook that auto-hashes passwords with bcrypt (salt rounds: 10). Only hashes when password is modified.

### API Response Patterns
- Success: Return data directly or with wrapper object
- Error: `{ error: 'message' }` with appropriate HTTP status code
- 404 handler for undefined routes
- Global error handler logs stack trace

### Frontend API Usage Pattern
```javascript
import { challengeAPI } from '../services/api';

// All API functions are async and return response.data
const challenges = await challengeAPI.getAllChallenges({ category: 'fitness' });
```

Token automatically injected from localStorage. 401 responses auto-redirect to `/login`.

## Development Workflow Notes

- **No authentication middleware**: Routes directly handle JWT validation
- **AI functions are placeholders**: aiRoutes.js has helper functions that need Gemini API integration
- **Empty directories**: `backend/config/`, `backend/services/`, `backend/middleware/` exist but are empty
- **Model-first architecture**: Business logic methods exist on Mongoose models (see User model methods)
- **No TypeScript**: Pure JavaScript codebase
- **Vite dev server**: Proxies `/api/*` requests to backend automatically

## Common Development Tasks

### Adding a New Route
1. Define route handler in appropriate `backend/routes/*Routes.js` file
2. Use existing models (User, Challenge, Progress, Message, Coach)
3. Follow existing error handling pattern: try-catch with 500 status
4. Add corresponding API function in `frontend/src/services/api.js`

### Adding a New Model Field
1. Update schema in `backend/models/*.js`
2. If user-related, check if User model needs update for references
3. No migrations needed - MongoDB is schemaless, but update seed data if exists

### Integrating Real AI Features
- Replace placeholder functions in `backend/routes/aiRoutes.js`
- Use `GEMINI_API_KEY` and `GEMINI_MODEL` from process.env
- Install/use `@google/generative-ai` package (already in dependencies)

## Testing Strategy

Backend testing uses Jest with Supertest (configured but tests not implemented). To add tests:
- Create test files alongside route files
- Use `npm test` to run in watch mode
- Test HTTP endpoints with Supertest against Express app export from server.js
