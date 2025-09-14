Farm2Home Complete Enhanced
---------------------------
This package contains a full-featured MERN app with Tailwind frontend, image uploads, search/pagination, auto-assignment of delivery agents, Dockerfile, Procfile, and basic Jest tests.

How to run locally:
1. Server:
   - cd server
   - npm install
   - copy .env.example -> .env and set values
   - npm run seed
   - npm run dev
2. Client:
   - cd client
   - npm install
   - create .env with REACT_APP_API=http://localhost:5000
   - npm start

Deployment:
- Backend: Use Dockerfile or push to Heroku (Procfile present).
- Frontend: Deploy to Vercel/Netlify (build output from react-scripts build).

Notes:
- Images uploaded via product creation are stored in server/uploads and served statically at /uploads/<filename>.
- Tests are scaffolded under server/tests (jest + supertest) and can be extended.
