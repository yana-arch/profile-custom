<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 Dynamic Profile - AI-Powered Portfolio Generator

A modern, responsive portfolio application built with React, TypeScript, and Vite. Features dynamic profile generation, AI-powered content suggestions, extensive customization options, and multi-user support with Supabase.

## ✨ Features

- **🎨 Dynamic Theming**: Light/dark mode with customizable colors and fonts
- **⚡ Performance Optimized**: Lazy loading, code splitting, and bundle optimization
- **🛠️ Admin Panel**: Full-featured admin interface for content management
- **🤖 AI Integration**: Google Gemini AI for content generation and suggestions
- **📱 Responsive Design**: Works seamlessly across all devices
- **🔧 Rich Text Editor**: Quill.js integration for formatted content
- **🔐 Multi-User Authentication**: Supabase Auth with social login support
- **👥 Multi-Profile Management**: Create and manage multiple profiles per user
- **📊 Template Marketplace**: Community-driven template sharing system
- **🖼️ Image Optimization**: Lazy loading with intersection observer
- **⚠️ Error Boundaries**: Graceful error handling and recovery
- **⏳ Loading States**: Skeleton loading for better UX
- **🌐 Public Profile Sharing**: Shareable links for public profiles

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18.2 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: React hooks + Supabase real-time subscriptions
- **Rich Text**: React Quill
- **AI Integration**: Google Generative AI
- **Authentication**: Supabase Auth with social providers
- **Database**: PostgreSQL with Row Level Security
- **Icons**: Heroicons
- **Build Tool**: Vite with optimized bundling

### Project Structure

```
├── components/
│   ├── common/          # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LazyImage.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── icons/           # Icon components
│   ├── profile/         # Profile-specific components
│   └── admin/           # Admin panel components
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── public/              # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd profile-custom
   npm install
   ```

2. **Supabase Setup:**

   ```bash
   # Create Supabase project at https://supabase.com
   # Copy the project URL and anon key to .env.local
   echo "VITE_SUPABASE_URL=your_supabase_project_url" >> .env.local
   echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env.local
   ```

3. **AI Integration Setup:**

   ```bash
   # Add Gemini API key for AI features
   echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env.local
   ```

4. **Database Migration:**

   ```bash
   # Run the SQL migration in Supabase Dashboard
   # Go to SQL Editor and run: database/migrations/001_initial_schema.sql
   ```

5. **Run Development Server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Docker build and run
docker build -t profile-custom .
docker run -p 3000:3000 profile-custom
```

### Key Components

#### 🎯 Main Components

- **App.tsx**: Main application component with state management
- **Profile.tsx**: Main profile display component
- **AdminPanel.tsx**: Administrative interface
- **Onboarding.tsx**: First-time user setup

#### 🔧 Utility Components

- **ErrorBoundary**: Catches and handles React errors
- **LazyImage**: Optimized image loading with intersection observer
- **LoadingSkeleton**: Loading state placeholders

#### 🎨 Layout Components

- **ScrollView**: Vertical scrolling layout
- **TabView**: Tabbed interface layout
- **SlideView**: Horizontal sliding layout

## ⚙️ Configuration

### Theme Customization

The app supports extensive theme customization through the admin panel:

- **Color Scheme**: Primary and secondary colors
- **Typography**: Font family selection
- **Layout**: Scroll, tab, or slide layouts
- **Animations**: Scroll and hover effects
- **Border Radius**: Customizable component rounding
- **Box Shadows**: Multiple shadow intensities

### Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Bundle Optimization**: Vendor chunk separation
- **Image Lazy Loading**: Intersection Observer API
- **Component Memoization**: Optimized re-rendering
- **Tree Shaking**: Unused code elimination

## 🔐 Authentication & Database

### Supabase Integration

The application now uses **Supabase** for backend services:

- **Authentication**: Multi-provider auth (Email/Password, Google, GitHub)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Real-time**: Live data synchronization
- **Storage**: File storage for images and assets

### User Management

- **Multi-user support**: Each user can create multiple profiles
- **Profile sharing**: Public/private profiles with shareable links
- **Template system**: Community-driven template marketplace
- **Social login**: Google and GitHub OAuth integration

### Database Schema

The application uses a comprehensive database schema:

```sql
-- 7 main tables:
- users (authentication & user data)
- profiles (portfolio data storage)
- templates (community templates)
- template_categories (template organization)
- profile_shares (public profile sharing)
- user_sessions (session management)
- css_validations (custom CSS validation)
```

## 🔒 Security

- **Row Level Security**: Database-level access control
- **Input validation**: Comprehensive data sanitization
- **XSS protection**: React's built-in escaping
- **Secure authentication**: JWT-based auth with Supabase
- **CORS protection**: Configured for cross-origin requests
- **Dependency scanning**: Automated vulnerability detection

## 🚢 Deployment

### Docker Deployment

```bash
# Build image
docker build -t profile-custom .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key profile-custom
```

### Manual Deployment

```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google AI Studio for the Gemini API
- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework

---

**View your app in AI Studio:** https://ai.studio/apps/drive/11pV80zhFpIKwjNoB9Wzy216C5tBTCTgl
