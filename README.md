# FEED SPACE

A modern RSS feed reader built with Next.js, Supabase, and Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel account (for deployment)

### 1. Environment Variables
Create a `.env.local` file and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup
1. Create a new Supabase project
2. Run the SQL from `supabase/schema.sql` in the SQL Editor
3. Enable Email Auth in Authentication settings

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deployment to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Features
- User authentication
- Add up to 10 RSS feeds per user
- Auto-refresh feeds every 30 minutes
- Articles expire after 24 hours
- Dark mode UI
- Responsive design
