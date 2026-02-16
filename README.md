<div align="center">

# 🔖 Smart Bookmark App

**A real-time bookmark manager with seamless synchronization across all your devices**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%7C%20Auth%20%7C%20Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

Smart Bookmark App is a modern, full-stack web application that allows users to save, organize, and access their bookmarks from anywhere. Built with cutting-edge technologies, it features real-time synchronization, secure authentication, and a beautiful responsive design.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Secure sign-in using Google authentication (no passwords to remember) |
| ➕ **Add Bookmarks** | Save URLs with custom titles for easy organization |
| 🔒 **Private & Secure** | Each user's bookmarks are completely private with Row Level Security |
| ⚡ **Real-time Sync** | Bookmarks update instantly across all open tabs and devices |
| 🗑️ **Easy Management** | Remove unwanted bookmarks with a single click |
| 🎨 **Modern UI** | Beautiful, responsive design that works on any device |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |

### Backend & Services
| Technology | Purpose |
|------------|---------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service |
| [PostgreSQL](https://www.postgresql.org/) | Database (via Supabase) |
| [Supabase Auth](https://supabase.com/auth) | Authentication with Google OAuth |
| [Supabase Realtime](https://supabase.com/realtime) | WebSocket subscriptions |

---

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Supabase account** ([Free tier available](https://supabase.com))
- **Google Cloud Console account** ([For OAuth setup](https://console.cloud.google.com/))

---

## 🚀 Getting Started

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd smart-bookmark-app

# Install dependencies
npm install
```

### Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Wait for the project to fully initialize

### Step 3: Configure Database

1. Navigate to **SQL Editor** in your Supabase dashboard
2. Copy and run the SQL from `supabase/migrations/001_create_bookmarks_table.sql`

<details>
<summary>📄 What the migration creates</summary>

- `bookmarks` table with UUID primary key
- Row Level Security (RLS) enabled
- Security policies for CRUD operations
- Performance indexes
- Real-time subscriptions

</details>

### Step 4: Configure Google OAuth

<details>
<summary>🔧 Google Cloud Console Setup</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**

**Configure URLs:**

| Type | URL |
|------|-----|
| Authorized JavaScript origins | `http://localhost:3000` |
| Authorized redirect URIs | `https://<your-project-ref>.supabase.co/auth/v1/callback` |

6. Copy the **Client ID** and **Client Secret**

</details>

**In Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste your Client ID and Client Secret

### Step 5: Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 Find these values in Supabase: **Settings** → **API**

### Step 6: Enable Realtime

1. Go to **Database** → **Replication** in Supabase dashboard
2. Enable replication for the `bookmarks` table
3. *(This is automatic if you ran the migration SQL)*

### Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📁 Project Structure

```
smart-bookmark-app/
│
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 auth/callback/      # OAuth callback handler
│   │   ├── 📂 login/              # Login page
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main dashboard
│   │
│   ├── 📂 components/             # React components
│   │   ├── BookmarkForm.tsx       # Add bookmark form
│   │   ├── BookmarkItem.tsx       # Single bookmark display
│   │   ├── BookmarkList.tsx       # List with realtime updates
│   │   └── Header.tsx             # Navigation header
│   │
│   ├── 📂 lib/supabase/           # Supabase clients
│   │   ├── client.ts              # Browser client
│   │   ├── middleware.ts          # Auth middleware helper
│   │   └── server.ts              # Server client
│   │
│   ├── 📂 types/                  # TypeScript definitions
│   │   └── database.ts            # Database types
│   │
│   └── middleware.ts              # Next.js auth middleware
│
├── 📂 supabase/migrations/        # Database migrations
│   └── 001_create_bookmarks_table.sql
│
├── 📂 public/                     # Static assets
├── .env.local.example             # Environment template
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript config
```

---

## 🧪 Testing Real-time Sync

Test the real-time functionality:

1. Open the app in **two browser tabs**
2. Sign in with the **same Google account** in both
3. Add a bookmark in one tab
4. **Watch it appear instantly** in the other tab! ⚡

---

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Configure environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |

4. Deploy!

> ⚠️ **Important:** Update Google OAuth settings to include your production URLs

---

## 🔒 Security

| Feature | Description |
|---------|-------------|
| **Row Level Security** | PostgreSQL RLS ensures users can only access their own data |
| **Server-side Auth** | Authentication verified on the server for every request |
| **Middleware Protection** | Next.js middleware protects all authenticated routes |
| **Secure Cookies** | HTTP-only cookies prevent XSS attacks |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**

[⬆ Back to Top](#-smart-bookmark-app)

</div>

