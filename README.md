# StudySpark
An AI-powered study buddy that helps you learn faster with explanations, notes, flashcards, quizzes, and a personal analytics dashboard.

**Live Demo:** https://studyspark12.vercel.app/ 
**API (Render):** https://studyspark12.onrender.com  
**Health Check:** https://studyspark12.onrender.com/health  

---

## What it does
StudySpark is a full-stack web app that lets users:
- Create an account + log in (JWT auth)
- Ask for AI explanations (student-friendly)
- Generate study notes, flashcards, and quizzes
- Track study activity (topics + feature usage)
- View progress in an analytics dashboard (charts + recent sessions)

**Guest mode supported** (try features without signing up)

---

## Why I built it
I wanted a learning tool that feels like a real assistant during late-night study sessions. StudySpark is designed around real student friction: confusion, time pressure, and needing quick practice + review.

---

## Tech Stack
**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2

**Backend**
- Node.js + Express
- PostgreSQL (Neon)
- JWT Authentication
- OpenAI API (server-side only)

**Deployment**
- Vercel (frontend) • Render (backend) • Neon (database)

---

## Architecture (high-level)
- Next.js UI calls the Express API using `NEXT_PUBLIC_API_BASE_URL`
- Auth uses JWT (token stored client-side, sent as `Authorization: Bearer <token>`)
- Backend talks to Postgres for user accounts
- Analytics endpoint stores per-user analytics (currently in-memory)
