# Recipe Explorer

A full-stack recipe platform where users discover, share and cook recipes.

**Live demo:** PASTE_YOUR_VERCEL_LINK_HERE
(The backend runs on a free plan, so the first load can take up to a minute.)

## Features
- Sign up and log in (JWT authentication, bcrypt password hashing)
- Create, edit and delete your own recipes
- Search by title, description or ingredient, and filter by category
- **What can I cook?** Enter the ingredients you have and see recipes ranked by match percentage, with the missing ingredients listed
- Cooking mode with one step at a time, an ingredient checklist and a copyable shopping list
- Save recipes to a favourites list

## Tech stack
- Frontend: React, React Router, Axios, Vite
- Backend: Node.js, Express, JSON Web Tokens
- Database: MongoDB Atlas (Mongoose)
- Hosting: Vercel (frontend), Render (backend)

## Run locally
1. Clone the repo.
2. Backend: `cd backend`, `npm install`, create a `.env` with `PORT`, `MONGO_URI` and `JWT_SECRET`, then `node server.js`.
3. Optional sample data: sign up once in the app, then `npm run seed` in `backend`.
4. Frontend: `cd frontend`, `npm install`, create a `.env` with `VITE_API_URL=http://localhost:5001/api`, then `npm run dev`.

## Screenshots
Add your screenshots here.

## Credits
Food photos from Unsplash / Pexels. Add the photographers' names here.
