# Recipe Explorer

A full-stack recipe platform where users discover, share and cook recipes.

**Live demo:** 

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
<img width="500" alt="home image" src="https://github.com/user-attachments/assets/3d030215-7f0c-4050-a08d-7a3f0b8fbeab" />
<img width="500" alt="home image" src="https://github.com/user-attachments/assets/a0a15efd-6b4e-4c1b-ad56-55893ea7c565" />
<img width="500" alt="home image" src="https://github.com/user-attachments/assets/28ae60bc-3534-4159-9339-68de4e5e5a98" />
<img width="500" alt="home image" src="https://github.com/user-attachments/assets/b28d5fe9-8d2d-490f-86c8-8ee4d163a9d9" />

