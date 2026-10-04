# AI Development Prompts

## Prompt 1

We are starting a MERN stack application called "LeadFlow".
IMPORTANT:
- The project root already contains two empty directories:
  - client/
  - server/
- The client and server folders are currently empty.
- For this step, ONLY initialize the project structure.
- Do NOT implement any application features or business logic.
- Do NOT create authentication, database schemas, APIs, routes, WebSockets, queues, or UI components yet.
Inside client/:
1. Initialize a Vite React application using JavaScript, NOT TypeScript.
2. Use the standard Vite React setup.
3. Inside client/src/, create these folders:
   assets/
components/
layouts/
pages/
routes/
services/
store/
hooks/
utils/
4. Do not add unnecessary libraries yet.
5. Keep the default Vite files that are required for the application to run.
Inside server/:
1. Initialize a Node.js project using npm.
2. Use ES Modules, NOT CommonJS.
3. Configure server/package.json with:
   "type": "module"
4. Add these scripts:
   "dev": "node --watch src/server.js"
"start": "node src/server.js"
5. Create this structure:
   server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── jobs/
│   ├── sockets/
│   └── utils/
├── .env.example
└── package.json
6. Create:
   server/src/app.js
server/src/server.js
7. app.js should only create and export an Express application instance.
8. server.js should import the Express app from app.js and start the server on:
   process.env.PORT || 5000
9. Install Express because it is required for the server to start.
10. Do not install any other dependencies yet.
11. Do not add routes, middleware, database connections, authentication, error handling, or business logic yet.
Create:
AGENTS.md
PROMPTS.md
README.md
Do not add any other unnecessary root-level files.
If an AGENTS.md already exists, do not overwrite it without checking its contents first.
For this step, the AGENTS.md should contain only the MERN/JavaScript development rules provided in the project instructions.
Create an empty prompt log with the heading:
Do not add any fake prompts to it.
After completing the task, show me:
1. Complete project directory tree.
2. client/package.json
3. server/package.json
4. server/src/app.js
5. server/src/server.js
6. Confirm that both client and server can start.
7. List every file created or modified.
Do not proceed to any application feature implementation.

## Prompt 2

Implement the next step of the LeadFlow backend: environment configuration and MongoDB connection.

IMPORTANT:
- Do ONLY this step.
- Do not implement authentication, users, roles, leads, clients, routes, controllers, or business logic yet.
- Do not modify the frontend.
- Follow AGENTS.md.
- Keep the implementation simple and production-friendly.

Tasks:

1. Install the required backend dependency:
   - mongoose
   - dotenv

2. Create/update the server environment configuration.

3. `server/.env.example` should contain placeholders for:

   PORT=5000
   MONGODB_URI=

   Do not put any real credentials in `.env.example`.

4. Ensure `.env` is ignored by Git.
   If the root `.gitignore` does not exist, create/update it appropriately.
   Do not add real secrets anywhere.

5. Create:

   server/src/config/env.js

   This module should load environment variables using dotenv and export the required configuration values.

6. Create:

   server/src/config/database.js

   This module should:
   - import mongoose
   - expose an async function such as `connectDatabase`
   - connect using the configured `MONGODB_URI`
   - throw/propagate connection errors instead of silently ignoring them
   - log a simple successful connection message

7. Update `server/src/server.js` so that:
   - environment configuration is loaded
   - MongoDB connection is established before starting the Express server
   - the HTTP server does NOT start if the database connection fails

8. Keep `server/src/app.js` responsible only for creating/exporting the Express application.
   Do not put database connection logic inside `app.js`.

9. Do not add any API routes or models yet.

10. Do not create a fake MongoDB URI.

11. Do not modify the existing client setup.

12. At the end, show me:
   - updated directory tree
   - server/package.json
   - server/src/config/env.js
   - server/src/config/database.js
   - server/src/server.js
   - server/.env.example
   - .gitignore changes
   - a short summary of what changed

Do not proceed to the next feature.

## Prompt 3