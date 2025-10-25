# Student Well-being Management System

A comprehensive web application designed to help students improve their well-being by encouraging them to leave their comfort zone with personalized, motivating challenges, rewarding progress with points, badges, and levels.

## 📋 Project Overview

This application uses AI-driven personalization to create tailored challenges that push users beyond their comfort zones. Users can track their progress, connect with friends, access certified coaches, and discover new opportunities for personal growth.

### Key Features

- **🎯 Personalized Challenges**: AI-powered challenge recommendations based on user profile, interests, and comfort zone level
- **📊 Progress Tracking**: Comprehensive tracking with points, badges, levels, and streak monitoring
- **💬 Messaging System**: Peer-to-peer and group messaging for social support
- **👨‍🏫 Coach Access**: Connect with certified wellness coaches for guidance
- **🔍 Discovery Feed**: Find friends, activities, and trending challenges
- **🤖 AI Intelligence**: Gemini AI integration for suggestions, motivation, and progress analysis
- **🏆 Gamification**: Points, levels, badges, and streaks to maintain engagement

## 🏗️ Architecture

### Backend (Node.js/Express.js)
- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Modular route structure

### Frontend (React.js)
- Modern React with Hooks
- React Router for navigation
- Axios for API communication
- Context API for state management

## 📁 Project Structure

```
student-wellbeing-app/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── Challenge.js
│   │   ├── Progress.js
│   │   ├── Message.js
│   │   └── Coach.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── challengeRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── messagingRoutes.js
│   │   ├── discoveryRoutes.js
│   │   ├── coachRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChallengesDashboard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── Messaging.jsx
│   │   │   ├── CoachAccess.jsx
│   │   │   └── DiscoveryFeed.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd ~/projects/student-wellbeing-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://ahmed:ahmed123@cluster0.j9rdkr7.mongodb.net/?appName=Cluster0
   JWT_SECRET=your_jwt_secret_key_here
   GEMINI_API_KEY=AIzaSyBTeu1xb7kHHNUskM4QCYnf9Iv4rPIZNWM
   GEMINI_MODEL=gemini-2.5-flash
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## 📡 API Endpoints

### Authentication & Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile
- `PUT /api/users/progress` - Update user progress
- `POST /api/users/friends/request` - Send friend request
- `PUT /api/users/friends/accept` - Accept friend request
- `GET /api/users/:id/badges` - Get user badges

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/personalized` - Get personalized challenges
- `GET /api/challenges/:id` - Get challenge by ID
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge
- `POST /api/challenges/:id/review` - Add review to challenge
- `GET /api/challenges/search/query` - Search challenges

### Progress Tracking
- `POST /api/progress` - Start a challenge
- `GET /api/progress/user/:userId` - Get user's progress
- `GET /api/progress/:id` - Get specific progress entry
- `PUT /api/progress/:id` - Update progress
- `PUT /api/progress/:id/complete` - Mark challenge as completed
- `POST /api/progress/:id/review` - Add review and rating

### Messaging
- `POST /api/messaging/send` - Send a message
- `GET /api/messaging/conversations/:userId` - Get user conversations
- `GET /api/messaging/chat/:userId/:recipientId` - Get chat messages
- `PUT /api/messaging/:id/read` - Mark message as read
- `GET /api/messaging/unread/:userId` - Get unread count

### Discovery
- `GET /api/discovery/users` - Discover users with similar interests
- `GET /api/discovery/trending` - Get trending challenges and users
- `GET /api/discovery/recommendations/:userId` - Get personalized recommendations
- `GET /api/discovery/search` - Universal search

### Coaches
- `GET /api/coaches` - Get all active coaches
- `GET /api/coaches/:id` - Get coach by ID
- `POST /api/coaches/:coachId/connect` - Connect with a coach

### AI Features
- `GET /api/ai/suggestions/:userId` - Get AI-generated suggestions
- `POST /api/ai/generate-challenge` - Generate personalized challenge
- `POST /api/ai/motivational-message` - Get motivational message
- `POST /api/ai/analyze-progress` - Get AI progress analysis

## 🗄️ Database Models

### User Model
- Authentication (email, password)
- Profile information (name, bio, avatar)
- Well-being profile (comfort zone level, interests, goals)
- Progress tracking (points, level, badges, streak)
- Social connections (friends, friend requests)
- Preferences and settings

### Challenge Model
- Basic information (title, description, category)
- Difficulty and scoring (difficulty, points reward)
- AI personalization criteria
- Engagement metrics
- Location and resources
- User reviews and ratings

### Progress Model
- User and challenge references
- Status tracking
- Progress metrics (percentage, steps completed)
- Points and rewards
- User reflections and feedback
- Milestones and checkpoints

### Message Model
- Sender and recipient information
- Message content and type
- Attachments and shared content
- Status tracking (read, delivered)
- Reactions and threading

### Coach Model
- Professional information
- Certifications and specializations
- Availability and scheduling
- Client management
- Ratings and reviews

## 🎨 Frontend Components

### Main Pages
- **Home**: Landing page with features showcase
- **Login/Register**: Authentication pages
- **Challenges Dashboard**: Browse and filter challenges
- **User Profile**: View and edit profile, badges, and stats
- **Progress Tracker**: Track active and completed challenges
- **Messaging**: Chat with friends and groups
- **Coach Access**: Browse and connect with coaches
- **Discovery Feed**: Find friends and trending content

### Context Providers
- **AuthContext**: Manages authentication state and user data

### Services
- **API Service**: Centralized API communication with axios interceptors

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookie support (configurable)
- Input validation and sanitization
- Protected API routes
- CORS configuration

## 🎮 Gamification System

- **Points**: Earned by completing challenges
- **Levels**: Calculated based on total points (100 points per level)
- **Badges**: Awarded for specific achievements
- **Streaks**: Daily activity tracking
- **Comfort Zone Progression**: Gradually increasing challenge difficulty

## 🤖 AI Integration

The application integrates with Google's Gemini AI (gemini-2.5-flash model) for:
- Personalized challenge recommendations
- Daily/weekly suggestions
- Motivational messages
- Progress analysis and insights
- Custom challenge generation

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop browsers
- Tablets
- Mobile devices

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to services like Heroku, Railway, or AWS
4. Ensure proper CORS settings

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure API base URL for production

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please open an issue in the repository.

## 🙏 Acknowledgments

- Gemini AI for intelligent features
- MongoDB for database
- React community for excellent tools
- Express.js for robust backend framework
