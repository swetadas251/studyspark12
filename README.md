# StudySpark
An AI-powered study buddy that helps you learn faster with explanations, notes, flashcards, quizzes, and a personal analytics dashboard.

> Built to turn “I’m stuck” into “ohhh I get it.”

---

## What it does
StudySpark is a full-stack web app that lets users:
- Create an account + log in
- Ask for AI explanations (clear, student-friendly)
- Generate study notes, flashcards, and quizzes
- Track study activity automatically (feature usage + topics)
- View progress in a clean analytics dashboard (charts + recent sessions)

---

## Why I built it
I wanted a learning tool that feels like a real assistant during late-night study sessions — not another tab you forget about. StudySpark is designed around real student friction: confusion, time pressure, and needing quick practice + review.

---

## Tech Stack
**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2

**Backend**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- OpenAI API integration (server-side only)

---

## Features
### Core Learning Tools
- AI explanations for concepts
- Smart notes generation
- Flashcard creation
- Quiz generation

### Analytics Dashboard
- Total study sessions
- 7-day activity chart
- Feature usage breakdown
- Top topics
- Recent session history

### Authentication
- Register / Login
- JWT token stored client-side
- Protected endpoints on backend

---

## Project Structure
```txt
ai-study-buddy/
  backend/   # Express API + Postgres
  frontend/  # Next.js app
