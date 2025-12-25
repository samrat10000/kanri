# Kanri (管理)

> **A Japanese-inspired task management system with Zen productivity features**

Kanri combines powerful task management with mindful productivity tools, wrapped in a beautiful Japanese aesthetic theme system.

## ✨ Features

### 📋 Task Management
- **Kanban Board**: Drag-and-drop interface powered by @dnd-kit
- **Priority Levels**: High, Medium, Low task prioritization
- **Status Tracking**: Pending, In Progress, Completed
- **Due Dates**: Task scheduling and deadline management
- **Search & Filter**: Advanced task filtering and search capabilities

### 🎨 Beautiful Themes (30+ Options)
- **Traditional Japanese**: Sakura, Matcha, Indigo, Momiji
- **City Vibes**: Akihabara, Kyoto, Shinjuku, Matrix
- **Aesthetic Calm**: Nord, Sage, Cream, Lavender
- **Anime-Inspired**: Ghibli, One Piece, Naruto, Demon Slayer
- **Retro/Synth**: Synthwave, Cyberpunk, Vaporwave, Pixel
- **Nature & Zen**: Zen Garden, Midnight Forest, Morning Mist
- **Cosmic**: Starry Night, Sunset, Your Name

### 🧘 Zen Productivity Tools
- **🎍 Zen Rituals**: Daily habit tracker with bloom animations (🌱→🌸)
- **🕯️ Brain Dump**: Persistent notepad for quick thoughts
- **🌸 QuickStats**: Completion rate ring, task flow visualization, priority pulse, and "Best Day" analytics
- **꩜ Pomodoro Zen**: Focus timer with custom modes (Standard 25/5, Deep Focus 50/10, Quick Burst 15/3)
- **🎵 Lofi Player**: Built-in radio with ambience mixer (Rain, Fire, Night, Birds, Wind, Thunder)

### 🎯 Additional Features
- **Authentication**: Secure JWT-based auth with HTTP-only cookies
- **Focus Mode**: Distraction-free task view
- **Celebration Effects**: Sakura petals on task completion
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Modes**: Plus 30+ custom themes

## 🚀 Tech Stack

### Frontend
- **React 19** with Hooks
- **Vite** for blazing-fast builds
- **React Router** for navigation
- **Axios** for API calls
- **@dnd-kit** for drag-and-drop

### Backend
- **Node.js** + **Express**
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcryptjs** password hashing
- **Security**: Helmet, CORS, XSS protection, MongoDB sanitization

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kanri
```

2. **Backend Setup**
```bash
cd back
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/kanri_db
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

3. **Frontend Setup**
```bash
cd ../client
npm install
```

4. **Run the Application**

Terminal 1 (Backend):
```bash
cd back
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`

## 📂 Project Structure

```
kanri/
├── back/                    # Backend API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route logic
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── app.js          # Express setup
│   │   └── server.js       # Entry point
│   └── package.json
├── client/                  # Frontend React app
│   ├── public/
│   │   └── sounds/         # Lofi player audio files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── pages/          # Route pages
│   │   └── main.jsx        # Entry point
│   └── package.json
└── README.md
```

## 🎨 Theme System

Kanri features a powerful theme system with 30+ handcrafted themes. Switch themes from the dropdown in the dashboard.

**Theme Categories:**
- Traditional (5 themes)
- City & Retro (5 themes)
- Vibe & Aesthetic (6 themes)
- Retro/Synth (3 themes)
- Anime (4 themes)
- Nature & Zen (7 themes)

Each theme includes custom colors, gradients, and glow effects for a complete visual experience.

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters, search, sort)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🌸 Philosophy

Kanri (管理) means "management" in Japanese. This app embodies the Japanese philosophy of mindful productivity - combining efficiency with calm, intention with execution, and work with well-being.

## 📄 License

MIT

## 🙏 Acknowledgments

- Sound effects from SoundJay.com
- Inspired by Japanese aesthetics and Zen philosophy
- Built with ❤️ for mindful productivity

---

**Kanri** - Manage tasks, mindfully.
