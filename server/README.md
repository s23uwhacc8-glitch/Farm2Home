Server README
-------------
1. npm install
2. copy .env.example to .env and set MONGO_URI, JWT_SECRET
3. npm run seed
4. npm run dev (requires nodemon)
Deployment:
- Use Dockerfile to build container.
- Or push to Heroku with Procfile.
