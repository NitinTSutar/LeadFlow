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

Implement the backend authentication and multi-tenant foundation for LeadFlow.

Before making code changes, inspect the existing server structure, package.json, AGENTS.md, and current environment/database configuration. Preserve the existing architecture and conventions.

## 1. Dependencies

Install only the dependencies required for this authentication step:

- bcryptjs
- jsonwebtoken
- cookie-parser
- cors

Do not install TypeScript, frontend dependencies, Socket.IO, email libraries, file-upload libraries, queue libraries, or other dependencies that are not required yet.

## 2. Database Models

Create a Brokerage Mongoose model with:

- name
- timestamps

Create a User Mongoose model with:

- name
- email
- passwordHash
- role
- brokerageId
- timestamps

Use appropriate Mongoose validation and indexes where useful.

The supported roles are:

- platformAdmin
- brokerageAdmin
- advisor
- client

Email should be normalized consistently so duplicate accounts cannot be created because of email casing differences.

brokerageId should reference the Brokerage model.

Do not store plain-text passwords.

## 3. Environment Configuration

Extend the existing environment configuration with:

JWT_SECRET=
COOKIE_SECURE=false

Keep the existing PORT and MONGODB_URI configuration.

Update server/.env.example accordingly.

Do not commit or expose real secrets.

## 4. Authentication

Implement authentication using JWT stored in an HTTP-only cookie.

Create:

POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

Login should:

1. Validate the submitted email and password.
2. Normalize the email.
3. Find the user by email.
4. Verify the password using bcryptjs.
5. Generate a JWT containing only the minimum required identity information.
6. Store the JWT in an HTTP-only cookie.
7. Return safe user information.
8. Never return passwordHash.

The authentication cookie should use appropriate security settings. Use COOKIE_SECURE from environment configuration so local development works over HTTP while production can use secure cookies.

Logout should clear the authentication cookie.

GET /api/auth/me should return the currently authenticated user's safe information.

## 5. Authentication Middleware

Create authentication middleware that:

1. Reads the JWT from the HTTP-only cookie.
2. Rejects requests without a valid token with HTTP 401.
3. Verifies the JWT using JWT_SECRET.
4. Loads the corresponding user from MongoDB.
5. Attaches the authenticated user to req.user.
6. Never expose passwordHash through req.user responses.

Handle expired, invalid, and missing tokens safely.

Do not trust user identity, role, or brokerageId sent by the frontend.

## 6. Role-Based Authorization

Create reusable role-based authorization middleware.

It should allow routes to specify which roles are allowed to access them.

For example, the middleware should support usage conceptually similar to:

requireRole("brokerageAdmin", "advisor")

Return HTTP 403 when the authenticated user does not have the required role.

Keep this middleware generic so it can be reused by future lead, client, document, task, and dashboard routes.

## 7. Multi-Tenant Foundation

Establish the backend foundation for strict brokerage-level tenant isolation.

Rules:

- Every brokerage user has a brokerageId.
- Backend code must derive the brokerage context from the authenticated user.
- Never trust a brokerageId supplied by the client to determine tenant access.
- Never rely on frontend filtering for tenant isolation.
- Database queries for brokerage-owned resources must be scoped by the authenticated user's brokerageId.
- A user belonging to Brokerage A must never be able to access Brokerage B's data by changing an ID in the request.
- platformAdmin is the only role that may operate across brokerages.
- client users must also remain restricted to their own brokerage and their own client-related resources.

Create reusable helper/middleware patterns where appropriate for enforcing tenant context, but do not over-engineer a generic framework yet.

Do not implement lead, client-case, document, or pipeline business logic in this step.

## 8. CORS and Cookies

Configure Express CORS correctly for the frontend/backend architecture.

Use environment-based configuration where appropriate rather than hardcoding production URLs.

Enable credentials because authentication uses HTTP-only cookies.

Add cookie-parser and configure Express JSON parsing as required.

Do not weaken security by allowing unrestricted credentialed origins.

If a frontend origin environment variable is needed, add it to .env.example and explain it.

## 9. Project Architecture

Follow the existing architecture:

Route → Controller → Service → Model/DB

Keep:

- routes responsible for route definitions
- controllers thin
- authentication/business logic inside services
- database schemas/models inside models
- reusable authentication/authorization logic inside middleware

Do not put large amounts of business logic directly inside route files.

## 10. Error Handling

Implement clear handling for:

- missing credentials
- invalid credentials
- missing authentication cookie
- invalid JWT
- expired JWT
- insufficient role permissions
- missing required configuration

Do not leak sensitive information through error responses.

For login failures, avoid revealing whether an email exists in the database.

## 11. API Structure

Create the authentication route structure under:

/api/auth

Keep the API naming consistent with the existing project.

Do not implement any unrelated endpoints.

## 12. Development Test Support

Do not create a production-facing public registration endpoint.

## 13. Scope Restrictions

Do NOT implement any of the following yet:

- Tally webhook
- lead ingestion
- duplicate lead detection
- pipeline
- advisor assignment
- lead-to-client conversion
- client portal
- document upload
- background document checking
- queues/workers
- email templates
- email sending
- tasks
- WebSockets
- Socket.IO
- dashboard
- frontend authentication UI
- OAuth
- TypeScript

Do not modify the client application except if absolutely required for CORS configuration; no frontend authentication implementation is needed yet.

Do not modify the existing MongoDB connection architecture unless necessary.

Do not add unnecessary abstractions or dependencies.

## 14. Verification

After implementation:

1. Show the updated server directory tree.
2. Show server/package.json.
3. Show the User model.
4. Show the Brokerage model.
5. Show authentication service.
6. Show authentication middleware.
7. Show role middleware.
8. Show authentication routes/controllers.
9. Show relevant environment configuration changes.
10. Explain exactly how tenant isolation is enforced.
11. Explain the JWT cookie configuration.
12. Explain the development test-user mechanism.
13. Provide the commands needed to run and test the authentication flow.
14. Run the relevant checks/tests if available and report their results.
15. Mention any issues or assumptions.

Do not implement anything outside this scope.

## Prompt 4

Remove the development test mechanism that was added as part of the authentication implementation.

Remove all test-specific code and configuration:

1. Delete the development test script file.

2. Remove the development test script from server/package.json.

3. Remove all development test environment variables from server/.env.example.

4. Remove any test-specific imports or references from the codebase.

5. Do not modify the User model, Brokerage model, authentication service, authentication middleware, routes, controllers, database connection, or existing authentication behavior unless required to remove test references.

6. Do not add another test mechanism or registration endpoint.

7. Do not modify the client.

After the changes:
- show the updated server/package.json
- show the updated server/.env.example
- show the files deleted
- search the project for removed test references and confirm there are no remaining references
- provide a concise summary

Do not make any unrelated changes.

## Prompt 5

Implement the Lead foundation for LeadFlow.

Before making changes, inspect the existing backend structure, AGENTS.md, authentication middleware, User model, Brokerage model, and current API conventions. Preserve the existing architecture.

## 1. Lead Model

Create a Mongoose Lead model with the following fields:

- brokerageId
- firstName
- lastName
- email
- phone
- source
- status
- assignedAdvisorId
- notes
- createdAt
- updatedAt

Use appropriate validation, normalization, indexes, and references.

Rules:

- brokerageId is required and references Brokerage.
- assignedAdvisorId references User and is optional.
- email should be normalized consistently.
- status must use a fixed set of pipeline statuses for the MVP:
  - NEW
  - CONTACTED
  - QUALIFIED
  - APPLICATION
  - WON
  - LOST
- source should identify where the lead came from, such as "tally".
- Add indexes that support common tenant-scoped queries.

Do not make the pipeline dynamically configurable yet.

## 2. Tenant Isolation

All lead operations must be strictly scoped to the authenticated user's brokerage.

Rules:

- Never trust brokerageId from the request body, query parameters, or URL parameters.
- For brokerage users, derive brokerageId exclusively from req.user.brokerageId.
- platformAdmin may operate across brokerages.
- A brokerage user must never be able to read, update, or delete another brokerage's lead by changing a lead ID.
- Database queries must enforce tenant isolation, not just frontend filtering.

Use the existing authentication and brokerage-context middleware where appropriate.

## 3. Lead API

Create the following endpoints:

- GET /api/leads
- GET /api/leads/:id
- POST /api/leads
- PATCH /api/leads/:id
- DELETE /api/leads/:id

All endpoints require authentication.

For brokerage users, all operations must be restricted to their own brokerage.

For platformAdmin, allow cross-brokerage access where appropriate, but do not weaken tenant isolation for normal brokerage users.

## 4. Lead Creation

POST /api/leads should accept:

- firstName
- lastName
- email
- phone
- source
- notes
- assignedAdvisorId
- status

Do not accept brokerageId from the client.

If status is omitted, default to NEW.

If source is omitted, default to "manual".

Validate assignedAdvisorId when provided.

The assigned user must:

- exist
- have the advisor role
- belong to the same brokerage as the lead creator

Do not allow assigning an advisor from another brokerage.

## 5. Lead Updates

PATCH /api/leads/:id should allow updating appropriate lead fields.

Do not allow clients to modify brokerageId.

Do not allow changing brokerage ownership through an update request.

When assignedAdvisorId is changed:

- validate that the new advisor exists
- validate that the advisor belongs to the same brokerage
- validate that the user has the advisor role

When status changes, validate that the new status is one of the supported pipeline statuses.

Do not implement stage automation, email triggers, tasks, or WebSockets yet. Those will be added later.

## 6. Lead Listing

GET /api/leads should support basic useful filters:

- status
- assignedAdvisorId
- source
- search

Search should support basic matching against relevant fields such as name, email, or phone.

Keep the implementation simple. Do not introduce a search engine or advanced filtering system.

All filters must still remain inside the authenticated user's tenant scope.

Return a useful paginated response rather than returning an unlimited number of records.

Use sensible defaults for page and limit and enforce a maximum limit.

## 7. Lead Detail

GET /api/leads/:id should return the lead only if the authenticated user has access to that lead.

If a brokerage user requests another brokerage's lead ID, do not reveal that the lead exists.

Use an appropriate not-found response.

## 8. Delete

DELETE /api/leads/:id should be restricted to appropriate roles.

For the MVP, allow:

- brokerageAdmin
- platformAdmin

Do not allow advisors or clients to delete leads.

Deletion must still enforce tenant isolation.

## 9. Architecture

Follow:

Route → Controller → Service → Model/DB

Keep:

- routes focused on route definitions
- controllers thin
- business logic in services
- database logic in models/services
- authorization in middleware

Reuse existing auth and role middleware.

Do not duplicate authentication logic.

## 10. Error Handling

Handle:

- validation errors
- invalid ObjectIds
- missing leads
- unauthorized access
- insufficient permissions
- invalid advisor assignment
- cross-tenant advisor assignment

Do not leak information about resources belonging to another brokerage.

## 11. Dependencies

Do not add unnecessary dependencies.

Use the existing Express and Mongoose stack.

## 12. Scope Restrictions

Do NOT implement yet:

- Tally webhook
- duplicate lead detection
- pipeline UI
- WebSockets
- Socket.IO
- email
- email templates
- tasks
- client conversion
- client portal
- document uploads
- background document processing
- queues/workers
- dashboard
- OAuth
- frontend lead UI

Only implement the backend Lead foundation and API.

Do not modify the existing authentication behavior.

Do not modify the client application.

## 13. Verification

After implementation:

1. Show the updated server directory tree.
2. Show the Lead model.
3. Show lead routes.
4. Show lead controllers.
5. Show lead services.
6. Explain exactly how tenant isolation is enforced.
7. Explain how cross-tenant lead access is prevented.
8. Explain how advisor assignment is validated.
9. Show the API endpoints and expected request/response behavior.
10. Run syntax checks/tests if available.
11. Report any assumptions or issues.

Do not implement anything outside this scope.

## Prompt 6

Add a temporary development-only endpoint to create the first platform administrator so that the authentication system can be tested locally.

Requirements:

1. Create:
   POST /api/dev/create-platform-admin

2. This endpoint must only work when NODE_ENV is not "production".

3. The request body should accept:
   - name
   - email
   - password

4. Validate all required fields.

5. Normalize the email using the existing authentication email normalization logic.

6. Hash the password using the existing bcryptjs strategy before saving it.

7. Create a User with:
   - name
   - normalized email
   - passwordHash
   - role: "platformAdmin"

8. Do not require a brokerageId for the platformAdmin.

9. If a platformAdmin already exists, reject the request instead of creating another one.

10. Never return password or passwordHash in the response.

11. Do not automatically log the user in or create a JWT. The purpose of this endpoint is only to create the development test account. Authentication must still be tested through the normal /api/auth/login endpoint.

12. Keep this endpoint isolated under /api/dev.

13. Do not add a public production signup or registration endpoint.

14. Do not modify the existing login, logout, authentication middleware, role middleware, or tenant isolation behavior.

15. Follow the existing architecture:
    Route → Controller → Service → Model/DB

16. Reuse existing authentication utilities where appropriate instead of duplicating password hashing or email normalization logic.

17. Add clear development-only protection and return an appropriate error if NODE_ENV is production.

18. Do not modify the client.

19. Do not implement brokerage creation yet.

20. Do not implement any other features.

After implementation:

- show the files changed
- show the development route
- show the controller/service implementation
- explain how production execution is prevented
- explain how duplicate platform admins are prevented
- run syntax checks
- provide the exact curl or PowerShell command needed to create the test platform admin
- provide the exact command needed to remove the test account later if necessary

Do not implement anything outside this scope.

## Prompt 7

Implement brokerage management for LeadFlow.

Context:
- This is a MERN stack application.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture rule: Route -> Controller -> Service -> Model/DB.
- Controllers must stay thin.
- Authentication uses JWT stored in an HTTP-only cookie.
- Roles are: platformAdmin, brokerageAdmin, advisor, client.
- Multi-tenancy is mandatory.
- A platformAdmin is global and has brokerageId = null.
- Tenant users must belong to exactly one brokerage.
- Do not trust brokerageId from request body for tenant ownership.
- Existing auth middleware includes requireAuth, requireRole, requireBrokerageContext and brokerageFilter.
- Existing User and Brokerage models already exist.
- Exactly one platformAdmin is allowed.

Requirements:

1. Create brokerage management APIs for platformAdmin:
   POST   /api/brokerages
   GET    /api/brokerages
   GET    /api/brokerages/:id
   PATCH  /api/brokerages/:id

2. Only platformAdmin can access these endpoints.

3. Brokerage fields should remain minimal:
   - name
   - timestamps

4. Validate brokerage name:
   - required
   - trimmed
   - minimum 2 characters
   - maximum 120 characters

5. Prevent duplicate brokerage names in a case-insensitive manner if practical with the existing architecture. Do not introduce unnecessary complexity.

6. Add an API to create a brokerage admin:
   POST /api/brokerages/:id/admins

7. Only platformAdmin can create a brokerage admin.

8. Brokerage admin creation should accept:
   - name
   - email
   - password

9. Normalize email before storing it.

10. Hash the password using the existing bcryptjs setup. Never store plaintext passwords.

11. Create the user with:
   role = "brokerageAdmin"
   brokerageId = the brokerage ID from the URL

12. Validate that the brokerage exists before creating its admin.

13. Do not allow the client to override role or brokerageId.

14. Reuse existing authentication/service utilities where appropriate instead of duplicating logic.

15. Add appropriate error handling:
   - invalid brokerage ID -> 400
   - brokerage not found -> 404
   - duplicate email -> 409
   - duplicate brokerage name -> 409
   - validation errors -> 400

16. Keep the implementation focused. Do not add frontend code, seed data, new libraries, or unrelated features.

17. Update PROMPTS.md by appending this exact prompt as the next prompt entry. Do not modify any previous prompt entries.

18. After implementation, ensure the server has no syntax/import errors.

Return a concise summary of:
- files created/changed
- API endpoints added
- authorization rules
- validation/error handling
- any assumptions made

## Prompt 8

Implement the Tally webhook lead ingestion flow for LeadFlow.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must stay thin.
- Existing Lead model and lead service already exist.
- Existing Lead statuses are:
  NEW, CONTACTED, QUALIFIED, APPLICATION, WON, LOST.
- Existing User/Brokerage models and authentication/multi-tenancy foundation already exist.
- Tally will be the first external lead source.
- Each Tally form belongs to exactly one brokerage.
- The backend must NEVER infer a brokerage from the form display name or default to a brokerage.
- The Tally form ID must map explicitly to a brokerage.

Goal:
Receive Tally form submissions and create leads automatically while safely handling duplicate webhook deliveries and duplicate people.

Requirements:

1. Create a Tally integration model that maps:
   - formId
   - brokerageId
   - active/enabled status
   - timestamps

2. Add appropriate indexes/constraints so one Tally form cannot be mapped to multiple brokerages.

3. Create a webhook endpoint:
   POST /api/webhooks/tally

4. The webhook endpoint must be publicly accessible and must NOT require normal JWT authentication.

5. Implement Tally webhook signature verification using the Tally-Signature header and the configured webhook signing secret.
   - Use the official Tally signing approach.
   - Keep the secret in environment variables.
   - Never hardcode the secret.
   - Reject invalid signatures with 401.
   - Do not log the signing secret.

6. Add the required environment configuration:
   TALLY_WEBHOOK_SECRET=
   Do not add the real secret to .env.example.

7. Parse the Tally webhook payload and extract:
   - eventId
   - eventType
   - data.formId
   - data.submissionId
   - submitted form fields

8. Only process the expected submission event type.
   For unsupported event types, return a safe 2xx response without creating a lead.

9. Find the brokerage using:
   data.formId -> TallyIntegration -> brokerageId

10. If the formId is not mapped to an active integration:
   - reject the webhook
   - do not create a lead
   - do not assign the event to any default brokerage.

11. Implement webhook idempotency.
   Create a model/table for processed webhook events containing at minimum:
   - eventId
   - eventType
   - formId
   - processedAt
   - timestamps

   eventId must be unique.

12. If the same eventId is received again:
   - do not create another lead
   - return a successful idempotent response.

13. Implement duplicate-person detection within the same brokerage.

   Normalize email and phone before comparison.

   Duplicate matching rules:
   - same brokerageId AND same normalized email
   OR
   - same brokerageId AND same normalized phone

   If an existing lead is found:
   - do not create a second lead
   - return a successful response indicating that an existing lead was matched.

14. If no duplicate person exists:
   create a new Lead with:
   - brokerageId from the Tally integration
   - firstName
   - lastName
   - email
   - phone
   - source = "tally"
   - status = "NEW"
   - notes if provided by the form
   - assignedAdvisorId should remain empty unless explicitly supported later.

15. Do not trust brokerageId from the Tally payload.

16. Keep Tally field mapping isolated in a service/helper so the webhook controller does not contain large mapping logic.

17. Since Tally payload field IDs can vary by form, make the mapping reasonably robust:
   - support common field labels such as First Name, Last Name, Email, Phone, Notes
   - normalize labels when matching.
   - Do not build a huge generic form engine.

18. Handle malformed payloads safely with 400.

19. Handle database/service failures with the existing global error handling approach.

20. IMPORTANT:
   Avoid marking the webhook event as processed before lead creation succeeds.
   The system must be safe if processing fails halfway through.

21. Keep the implementation focused.
   Do not implement queues, Socket.IO, email, tasks, frontend, or document processing in this prompt.

22. Add the necessary files/models/services/routes only.

23. Update PROMPTS.md by appending this exact prompt as Prompt 8.
   Do not modify any previous prompt entries.

24. Update server/.env.example with the new variable name only:
   TALLY_WEBHOOK_SECRET=

25. Do not add real secrets to source control.

26. Run syntax/import checks after implementation.

Return a concise summary of:
- files created/changed
- webhook flow
- signature verification
- idempotency strategy
- duplicate-person strategy
- Tally field mapping approach
- verification performed

## Prompt 9