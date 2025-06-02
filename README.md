# Flight Tracker for Part 135 Charter Ops

A lightweight flight scheduling and crew assignment tool with AI-powered insights, built to support the day-to-day operations of a Part 135 charter operator flying 2–3 Gulfstream 550 aircraft.

- **Charter Admins** – Assign aircraft, crew, and manage flight details  
- **Pilots & Crew** – View assigned flights, duty hours, and trip notes
- **AI Assistant** – Chat with recent flight data using natural language

### Demo Video  
Watch my walkthrough here:  
[Live Demo Video on Loom](https://www.loom.com/share/97b921eef9ed4f7ca6606162cc9c07f3?sid=6daa8348-5182-4bdd-85d3-32d79356b793)

### Live App  
Try the app live at:  
[gander-challenge-zohaib-manzoor.vercel.app](https://gander-challenge-zohaib-manzoor.vercel.app)


## Architecture

- **Client** - Next.js(App Router)
- **Backend/API** Server - Next.js + REST
- **Auth** - JWT *role-based access control* (admin vs crew)
- **Database** - Supabase
- **AI** - Google Gemini(Model: `gemini-2.0-flash`)
- **Deployment**: Vercel

## Features: 
1. Flight Schedule Management (Admin)
- View upcoming flights
- Create new flights with:
    - Date + Time
    - Aircraft tail number
    - Departure + arrival airports
    - Assigned crew (multi-select)
    - Notes (e.g. passenger count, catering, etc.)

2. Crew View (Pilot/Crew)
- Log in to view upcoming assigned flights
- Duty Hour Tracking

3. AI-Powered Chatting Feature (Admin)
- Chat interface that understands and responds to flight operations queries.
- Trained on the latest 50 flights.

- Can answer:
    - “How many total flight hours were logged last week?”
    - “Which aircraft flew the most in the last 30 days?”
    - “Who is assigned to the JFK departure on 6/8?"

## Misc: 
- Supabase credentials: 
    - Project Name: `flight-tracker-Gander` 
    - Database Password: `flight-tracker-Gander`

## Auth: 
A mock login system is provided with pre-set credentials for admin and crew roles. 

## Getting Started
1. Clone the repo via github SSH

```bash
git clone git@github.com:ZohaibManzoor00/flight-tracker-Gander.git
```

2. Install dependencies
```bash
bun install
```

3. Make a copy of .env.example and replace with you're credentials

4. Run migrations against database(Supabase)
Generate migrations using the `drizzle-kit` generate command and then apply them using the `drizzle-kit` migrate command:
```bash
Directly apply changes to schema:
bunx drizzle-kit push
```

5. Run seed script
```bash
bun run seed   
```

6. Run the local development server
```bash
bun run dev
```
