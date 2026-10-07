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

Implement the LeadFlow lead pipeline status transitions with Socket.IO realtime updates and optimistic concurrency protection.

Context:
- LeadFlow is a MERN stack application.
- Backend: Node.js, Express.js, MongoDB, Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Authentication uses JWT in an HTTP-only cookie.
- Roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Multi-tenancy is mandatory.
- Existing Lead model and lead CRUD APIs already exist.
- Existing lead statuses are:
  NEW
  CONTACTED
  QUALIFIED
  APPLICATION
  WON
  LOST
- Existing tenant isolation utilities and authentication middleware must be reused.
- Tally webhook lead ingestion already creates leads with status NEW.
- Do not modify previous PROMPTS.md entries.

Goal:
Allow authorized brokerage users to move leads between pipeline stages and broadcast successful changes in realtime to users in the same brokerage.

Requirements:

1. Add Socket.IO to the backend.

2. Add the required dependency if it is not already installed.

3. Create a clean Socket.IO setup under:
   server/src/sockets/

4. Initialize Socket.IO from the existing HTTP server in server/src/server.js.
   Do not create a second HTTP server.

5. Configure Socket.IO CORS using the existing frontend origin configuration.

6. Authenticate Socket.IO connections using the same JWT cookie used by the REST API.
   - Reject unauthenticated socket connections.
   - Resolve the authenticated user from the database.
   - Do not trust brokerageId sent by the client.

7. For authenticated tenant users, join a brokerage-specific room:
   brokerage:<brokerageId>

8. PlatformAdmin may connect but must not be treated as belonging to a brokerage room because brokerageId is null.

9. Create a focused pipeline status update API:
   PATCH /api/leads/:id/status

10. The request body should contain:
   - status
   - version

11. Only authenticated brokerage users with role brokerageAdmin or advisor can move leads.
   PlatformAdmin may also update leads where appropriate using existing platform-admin behavior.

12. Client users must never be allowed to move leads.

13. Validate that the requested status is one of the existing Lead statuses.

14. Preserve tenant isolation:
   - brokerage users can only update leads belonging to their brokerage.
   - never accept brokerageId from the request body.
   - cross-tenant lead IDs should behave as not found.

15. Implement optimistic concurrency protection.

   Add a numeric version field to Lead if it does not already exist.

   When updating a lead:
   - require the client to send the current version.
   - update only when the stored version matches the requested version.
   - atomically increment the version.
   - if the version does not match, return HTTP 409 Conflict.
   - return the latest lead state in the response.

16. Do not allow a stale request to overwrite a newer status.

17. Keep status transition rules simple and practical for the MVP.
   Any valid pipeline status may be selected from:
   NEW, CONTACTED, QUALIFIED, APPLICATION, WON, LOST.
   Do not build a complex workflow engine.

18. After a successful database update only, emit a Socket.IO event:
   lead:updated

19. Emit the event only to the relevant brokerage room.

20. The event payload should contain enough information for the frontend to update its state without immediately refetching the entire database.
   Include at minimum:
   - lead
   - previousStatus
   - newStatus
   - updated version

21. Do not emit realtime events when:
   - authentication fails
   - authorization fails
   - lead is not found
   - validation fails
   - version conflict occurs
   - database update fails

22. Keep Socket.IO event names and room names centralized rather than scattering string literals throughout the codebase.

23. Do not implement frontend Socket.IO code in this prompt.

24. Do not implement tasks, email automation, dashboard caching, client conversion, documents, or Tally changes in this prompt.

25. Preserve existing lead CRUD functionality.

26. Make sure existing PATCH /api/leads/:id behavior does not accidentally bypass the new concurrency protection for status changes.
   If necessary, route status changes through the new dedicated endpoint and keep the existing generic PATCH focused on non-status fields.

27. Handle invalid ObjectIds and validation errors consistently with the existing API behavior.

28. Run syntax checks and application import/startup checks after implementation.


Return a concise summary of:
- files created/changed
- Socket.IO authentication approach
- brokerage room strategy
- status update API
- optimistic concurrency/version strategy
- realtime event payload
- verification performed

## Prompt 10

Implement the Lead-to-Client conversion and client authentication foundation for LeadFlow.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Authentication uses JWT stored in an HTTP-only cookie.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Multi-tenancy is mandatory.
- Existing User, Brokerage, and Lead models already exist.
- Existing authentication middleware and RBAC utilities already exist.
- Existing Lead pipeline statuses are:
  NEW, CONTACTED, QUALIFIED, APPLICATION, WON, LOST.
- Existing lead status changes use a dedicated concurrency-protected endpoint.
- Existing tenant isolation rules must be preserved.
- Do not modify previous functionality unnecessarily.

Goal:
Allow an authorized advisor or brokerage admin to convert an existing lead into a client, create the client's account, and allow that client to authenticate and access only their own case.

Requirements:

1. Add the minimum necessary relationship between a Lead and its client account.

2. Add to the Lead model if not already present:
   - clientId: ObjectId reference to User, nullable
   - convertedAt: Date, nullable

3. A lead may be converted to a client only once.

4. Create a dedicated endpoint:
   POST /api/leads/:id/convert-to-client

5. Only these roles may convert a lead:
   - advisor
   - brokerageAdmin
   - platformAdmin

6. Client users must never be allowed to convert leads.

7. Preserve tenant isolation:
   - brokerage users can only convert leads belonging to their brokerage.
   - never accept brokerageId from the request body.
   - platformAdmin may operate across brokerages according to existing platform-admin behavior.

8. The conversion endpoint should use the lead's existing:
   - firstName
   - lastName
   - email
   - phone

   to create the client account.

9. A client account must:
   - have role = "client"
   - belong to the same brokerage as the lead
   - have a unique normalized email
   - never store a plaintext password.

10. The conversion request should accept a temporary password for the new client account.

11. Hash the temporary password using the existing bcryptjs setup.

12. Do not allow the request body to override:
   - role
   - brokerageId
   - clientId
   - lead ownership

13. If the lead has no email, return a validation error because email is required for client login.

14. If a user with the same email already exists:
   - if the existing user is a client belonging to the same brokerage and is not already linked to another incompatible case, safely reuse that client account rather than creating a duplicate user.
   - if the existing email belongs to a non-client role or belongs to another brokerage, return a clear conflict response.
   - do not move an existing user between brokerages.

15. If the lead has already been converted:
   - do not create another client.
   - return a conflict response with enough information for the caller to understand that the lead is already converted.

16. On successful conversion:
   - set lead.clientId
   - set lead.convertedAt
   - update the lead status to APPLICATION if appropriate for the existing pipeline.
   - increment the lead version using the existing concurrency/version approach.
   - preserve the existing brokerageId.

17. The conversion should be performed safely so that a client account is not accidentally created multiple times if two requests happen concurrently.
   Use a database-safe approach appropriate for the existing MongoDB/Mongoose architecture.
   Do not introduce unnecessary distributed locking.

18. Create a client-only endpoint:
   GET /api/client/case

19. This endpoint requires authentication and client role.

20. The endpoint must return the authenticated client's own case/lead information only.

21. Do not accept a leadId or clientId from the client request for this endpoint.
   The authenticated user's ID must determine which case is returned.

22. The returned case should contain useful MVP information such as:
   - lead/client name
   - email
   - phone if appropriate
   - current pipeline status
   - brokerage information needed by the client portal
   - convertedAt

23. Never return:
   - passwordHash
   - authentication tokens
   - internal secrets
   - unrelated users' data.

24. Reuse the existing /api/auth/login and /api/auth/me authentication system.
   Do not create a second authentication mechanism.

25. If a client has no linked case, return a clean 404 response.

26. Keep the implementation focused.
   Do not implement:
   - document uploads
   - document processing
   - email invitations
   - password reset
   - frontend UI
   - client notifications
   - OAuth

27. Reuse existing services/utilities where possible.
   Do not duplicate password hashing or email normalization logic unnecessarily.

28. Add appropriate validation and error handling:
   - invalid lead ID -> 400
   - lead not found -> 404
   - missing email -> 400
   - already converted -> 409
   - conflicting existing user -> 409
   - unauthorized role -> 403
   - unauthenticated -> 401

29. Preserve existing lead CRUD, Tally webhook, Socket.IO, authentication, and tenant isolation behavior.

30. Run syntax checks and application import/startup checks after implementation.

Return a concise summary of:
- files created/changed
- lead/client relationship
- conversion flow
- concurrency protection
- client case authorization
- validation/error handling
- verification performed

## Prompt 11

Implement the LeadFlow client document management system using Cloudflare R2 for file storage and a background document-checking workflow.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Authentication uses JWT stored in an HTTP-only cookie.
- Roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Multi-tenancy is mandatory.
- Lead-to-client conversion already exists.
- A Lead has a clientId relationship.
- Client users can access their own case through GET /api/client/case.
- Cloudflare R2 is the chosen object storage provider.
- Actual document files must NOT be stored in MongoDB.
- MongoDB should store document metadata and processing status.
- Do not implement document AI or real OCR. The assignment allows fake, slow, sometimes-failing background document checking.

Cloudflare R2 configuration:

Add these environment variables to server/.env.example:

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=

Do not add real credentials to source control.
Do not log R2 credentials.

Requirements:

1. Add the AWS S3-compatible SDK required to communicate with Cloudflare R2.

2. Create a focused R2 storage service under:
   server/src/services/

3. Configure the R2 client using environment variables.

4. Keep the R2 bucket private.
   Do not make uploaded documents publicly accessible.

5. Create a Document model with at minimum:
   - brokerageId
   - clientId
   - leadId
   - uploadedBy
   - originalName
   - storageKey
   - mimeType
   - size
   - status
   - failureReason
   - checkedAt
   - timestamps

6. Document statuses must be:
   UPLOADED
   PROCESSING
   APPROVED
   FAILED

7. Add useful indexes for:
   - brokerageId
   - clientId
   - leadId
   - status

8. Create a client document upload endpoint:
   POST /api/client/documents

9. The endpoint must require authentication and the client role.

10. The client must NOT provide:
    - brokerageId
    - clientId
    - uploadedBy
    - storageKey
    - status

11. Determine the client and brokerage exclusively from the authenticated user and their linked case.

12. A client without a linked case must receive 404.

13. Validate uploads:
    - allow common mortgage-document formats such as PDF, JPG, JPEG, and PNG.
    - enforce a reasonable maximum file size suitable for the MVP.
    - reject unsupported MIME types.
    - do not trust only the filename extension.

14. Store the actual file in Cloudflare R2.

15. Generate a unique storage key so one client cannot overwrite another client's document accidentally.

16. Do not expose the R2 secret or bucket credentials to the frontend.

17. Store only metadata in MongoDB:
    - original filename
    - storage key
    - MIME type
    - size
    - client/lead/brokerage references
    - status
    - timestamps

18. After a successful upload:
    - create the Document record with status UPLOADED.
    - start the background document-checking process.

19. Implement a lightweight background job mechanism appropriate for this MVP.
    Do not introduce Redis/BullMQ unless genuinely necessary.
    A simple in-process background worker/service is acceptable for the assignment.

20. The background checker should:
    - change status from UPLOADED to PROCESSING.
    - wait/simulate slow processing.
    - sometimes succeed with APPROVED.
    - sometimes fail with FAILED.
    - store failureReason when failed.
    - store checkedAt when processing completes.

21. Make the simulated failure deterministic enough for testing where practical, but do not make every document fail or succeed.

22. The HTTP upload request must NOT wait for the simulated document checking to finish.

23. If the Node process restarts, in-progress in-memory jobs may be lost.
    This limitation is acceptable for this MVP, but keep the code structured so a real queue could replace it later.

24. Create a client endpoint:
    GET /api/client/documents

25. It must return only documents belonging to the authenticated client's own case.

26. Do not accept clientId or brokerageId from the request query/body to determine ownership.

27. Create a document status endpoint:
    GET /api/client/documents/:id

28. It must verify that the document belongs to the authenticated client before returning it.

29. Clients must never be able to access another client's document metadata.

30. For document downloads, do NOT make the R2 bucket public.
    If implementing a download endpoint, generate a short-lived signed URL from the backend after verifying ownership.

31. Create an advisor/brokerage-admin endpoint to view documents for a lead/client:
    GET /api/leads/:leadId/documents

32. Only advisor, brokerageAdmin, and platformAdmin may access that endpoint.

33. Preserve tenant isolation:
    - brokerage users may only access documents belonging to their brokerage.
    - platformAdmin may access across brokerages according to existing platform-admin behavior.
    - cross-tenant document IDs must not expose data.

34. When a client uploads a document, emit a Socket.IO event after the Document record is successfully created:
    document:updated

35. Emit the event only to the relevant brokerage room.

36. When the background status changes:
    PROCESSING -> APPROVED
    or
    PROCESSING -> FAILED

    emit another document:updated event to the same brokerage room.

37. Keep Socket.IO event names centralized with the existing socket constants.

38. Do not implement:
    - OCR
    - AI document analysis
    - real bank document validation
    - email notifications
    - tasks
    - frontend UI
    - Redis/BullMQ
    - document versioning
    - document deletion
    - public R2 access

39. Handle failures safely:
    - if R2 upload fails, do not create a successful document record.
    - if MongoDB document creation fails after an R2 upload, attempt to clean up the uploaded R2 object.
    - background processing failures should result in FAILED status rather than crashing the server.

40. Keep controllers thin and put storage/background/document logic in services.

41. Preserve all existing authentication, Lead CRUD, Tally webhook, Socket.IO, tenant isolation, and lead-to-client functionality.

42. Run syntax checks and application import/startup checks after implementation.

Return a concise summary of:
- files created/changed
- R2 integration
- document metadata model
- upload flow
- background processing approach
- authorization/tenant isolation
- Socket.IO document events
- verification performed

## Prompt 12

Implement advisor management and advisor workload APIs for LeadFlow.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Existing authentication uses JWT in an HTTP-only cookie.
- Existing User model already supports the advisor role.
- Existing Lead model has:
  - brokerageId
  - assignedAdvisorId
  - status
- Existing Lead statuses:
  NEW, CONTACTED, QUALIFIED, APPLICATION, WON, LOST.
- Existing tenant isolation and RBAC middleware/utilities must be reused.
- Brokerage management already exists.
- Lead assignment validation already exists in the lead service.
- Do not modify previous PROMPTS.md entries.

Goal:
Allow brokerage admins to manage advisors within their brokerage and provide advisor workload information for lead assignment.

Requirements:

1. Create advisor management APIs:

   POST /api/brokerages/:id/advisors
   GET  /api/brokerages/:id/advisors
   GET  /api/brokerages/:id/advisors/:advisorId
   PATCH /api/brokerages/:id/advisors/:advisorId

2. Only brokerageAdmin and platformAdmin may manage advisors.

3. Brokerage Admin:
   - may only manage advisors belonging to their own brokerage.
   - must not be able to create or modify advisors in another brokerage even if another brokerage ID is supplied in the URL.
   - must not be able to change an advisor's brokerageId.

4. PlatformAdmin:
   - may manage advisors across brokerages.
   - brokerageId must come from the URL and must refer to an existing brokerage.

5. Advisor creation must accept:
   - name
   - email
   - password

6. Advisor creation must:
   - normalize email
   - hash password using existing bcryptjs utilities
   - set role = "advisor"
   - set brokerageId from the authorized brokerage context
   - never trust role or brokerageId from request body
   - never store plaintext passwords

7. Validate:
   - name: required, trimmed, 2–120 characters
   - email: valid and normalized
   - password: required with a reasonable minimum length
   - brokerage must exist

8. Duplicate email must return 409.

9. Do not allow an existing user with another role to be silently converted into an advisor.

10. Advisor list endpoint should return safe user information only:
    - id
    - name
    - email
    - role
    - brokerageId
    - active case count

11. Never return passwordHash.

12. Implement advisor active case count.

    An active case is a lead assigned to that advisor whose status is NOT:
    WON
    LOST

13. The active case count must be calculated from the Lead collection rather than stored as a manually maintained counter.

14. Advisor list should provide workload information in a form suitable for a lead-assignment dropdown, for example:

    {
      "id": "...",
      "name": "Nitin",
      "activeCaseCount": 3
    }

15. Only leads belonging to the same brokerage should be counted for a brokerage advisor.

16. Advisor detail endpoint should also return the advisor's active case count.

17. PATCH advisor should support reasonable profile updates such as:
    - name
    - email
    - password
    - active/inactive state if the existing User model supports it

    Do not allow changing:
    - role
    - brokerageId
    - user ID

18. If an active/inactive field does not already exist on User, add a minimal `isActive` boolean with default true.

19. Inactive advisors:
    - remain in the database
    - remain associated with historical leads
    - should not be presented as available for new lead assignment.

20. Update lead assignment validation so a lead cannot be newly assigned to an inactive advisor.

21. Do not automatically reassign existing leads when an advisor becomes inactive.

22. Add an endpoint specifically for available advisors for assignment:

    GET /api/brokerages/:id/advisors/available

    It should return only active advisors in the authorized brokerage, including:
    - id
    - name
    - activeCaseCount

23. Preserve tenant isolation:
    - brokerageAdmin can only access their own brokerage's advisors.
    - cross-tenant advisor IDs must not expose data.
    - platformAdmin may access across brokerages.

24. Handle invalid IDs and errors consistently:
    - invalid brokerage ID -> 400
    - invalid advisor ID -> 400
    - brokerage not found -> 404
    - advisor not found -> 404
    - duplicate email -> 409
    - unauthorized role -> 403
    - unauthenticated -> 401
    - validation errors -> 400

25. Reuse existing email normalization, authentication, password hashing, tenant filtering, and role utilities where possible.

26. Do not add frontend code.

27. Do not implement tasks, email templates, email sending, dashboard, or unrelated features in this prompt.

28. Preserve existing:
    - authentication
    - brokerage management
    - lead CRUD
    - Tally webhook
    - Socket.IO
    - lead status transitions
    - lead-to-client conversion
    - document management
    - tenant isolation

29. Run syntax checks and application import/startup checks after implementation.

Return a concise summary of:
- files created/changed
- advisor management endpoints
- authorization and tenant isolation
- active case count logic
- inactive advisor behavior
- lead assignment changes
- verification performed

## Prompt 13

Implement task management and pipeline task triggers for LeadFlow.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Authentication uses JWT stored in an HTTP-only cookie.
- Multi-tenancy is mandatory.
- Existing Lead model has:
  brokerageId
  assignedAdvisorId
  status
  version
- Existing pipeline statuses:
  NEW
  CONTACTED
  QUALIFIED
  APPLICATION
  WON
  LOST
- Existing lead status changes use:
  PATCH /api/leads/:id/status
  with optimistic concurrency/version checking.
- Existing Socket.IO broadcasts lead:updated events to brokerage rooms.
- Existing advisor management supports active/inactive advisors and active case counts.
- Existing tenant isolation and RBAC middleware/utilities must be reused.
- Do not modify previous PROMPTS.md entries.

Goal:
Implement brokerage-configurable task triggers so that when a lead enters a pipeline stage, configured tasks are created for the assigned advisor, with a due date and overdue state.

Requirements:

1. Create a Task model with at minimum:
   - brokerageId
   - leadId
   - advisorId
   - title
   - description
   - status
   - dueAt
   - completedAt
   - sourceStage
   - timestamps

2. Task statuses should be:
   TODO
   COMPLETED
   CANCELLED

3. Create a TaskTrigger model with at minimum:
   - brokerageId
   - stage
   - title
   - description
   - dueInMinutes
   - isActive
   - timestamps

4. Task triggers must be brokerage-specific.

5. A trigger's stage must be one of the existing Lead pipeline statuses.

6. Only brokerageAdmin and platformAdmin may create, update, list, activate/deactivate, and delete task triggers.

7. Brokerage admins may manage triggers only for their own brokerage.

8. Platform admins may manage triggers across brokerages.

9. Do not allow clients or advisors to modify task trigger configuration.

10. Create task-trigger configuration endpoints:

    POST   /api/brokerages/:id/task-triggers
    GET    /api/brokerages/:id/task-triggers
    PATCH  /api/brokerages/:id/task-triggers/:triggerId
    DELETE /api/brokerages/:id/task-triggers/:triggerId

11. Trigger creation/update should support:
    - stage
    - title
    - description
    - dueInMinutes
    - isActive

12. Validate:
    - title is required
    - title should be trimmed and have a reasonable maximum length
    - dueInMinutes must be a positive number
    - stage must be valid
    - brokerage must exist

13. When a lead successfully enters a pipeline stage through:
    PATCH /api/leads/:id/status

    find all active task triggers for:
    - the lead's brokerage
    - the new status/stage

14. For each matching active trigger:
    - create a Task
    - assign it to the lead's current assignedAdvisorId
    - use the trigger title/description
    - set sourceStage to the new lead status
    - set dueAt based on dueInMinutes from the trigger

15. If the lead has no assigned advisor:
    do not create an advisor-assigned task.
    Do not invent an advisor.
    The lead status change itself must still succeed.

16. Task creation must happen only after the lead status update succeeds.

17. Task creation should not cause the lead status update itself to fail if task creation encounters an isolated non-critical error.
    Log the task creation failure appropriately so the issue can be diagnosed.

18. Prevent accidental duplicate tasks if the same status update is retried or processed more than once.

19. Use the existing lead version/status transition mechanism to distinguish a real successful stage change from a stale/conflicting update.

20. If the lead status does not actually change, do not create task triggers.

21. Do not create tasks for arbitrary edits to a lead.

22. Create task APIs:

    GET   /api/tasks
    GET   /api/tasks/:id
    PATCH /api/tasks/:id
    PATCH /api/tasks/:id/complete

23. Task visibility:
    - advisor: only tasks assigned to that advisor and belonging to their brokerage
    - brokerageAdmin: tasks within their brokerage
    - platformAdmin: may access tasks across brokerages
    - client: no task access

24. Preserve tenant isolation on every task query and mutation.

25. Never trust brokerageId or advisorId from the client request when determining ownership.

26. For task creation caused by a trigger, advisorId must come from the lead's assignedAdvisorId.

27. For manually editing a task, do not allow users to move a task to another brokerage.

28. Only brokerageAdmin and platformAdmin may reassign a task to another advisor.
    When assigning a task to an advisor:
    - advisor must exist
    - advisor must have role advisor
    - advisor must belong to the same brokerage
    - advisor must be active

29. Advisors may update task fields relevant to completing their own work, but must not:
    - change brokerageId
    - change ownership to another brokerage
    - modify trigger configuration

30. Implement overdue detection.

    A task is overdue when:
    - status = TODO
    - dueAt is before the current time

    Do not store overdue as a separate mutable status unless necessary.

31. Task responses should include enough information for the frontend to visually distinguish overdue tasks.

32. Add useful indexes for:
    - brokerageId
    - advisorId
    - leadId
    - status
    - dueAt
    - trigger/stage lookup

33. Emit a Socket.IO event:
    task:updated

    after:
    - task creation
    - task completion
    - task update
    - task cancellation

34. Emit task events only to the relevant brokerage room.

35. Keep Socket.IO event names centralized with the existing socket constants.

36. Task trigger execution must not block the lead status endpoint unnecessarily.
    Keep the implementation simple and appropriate for the current MVP architecture.

37. Do not introduce Redis/BullMQ in this prompt.

38. Do not implement email templates, email sending, dashboard analytics, frontend UI, or unrelated features.

39. Preserve all existing:
    - authentication
    - RBAC
    - tenant isolation
    - Lead CRUD
    - Tally webhook
    - Socket.IO lead updates
    - Lead-to-client conversion
    - document management
    - advisor management

40. Handle errors consistently:
    - invalid IDs -> 400
    - resource not found -> 404
    - unauthorized -> 403
    - unauthenticated -> 401
    - validation errors -> 400
    - conflicts -> 409 where appropriate

41. Run syntax checks and application import/startup checks after implementation.

Return a concise summary of:
- files created/changed
- Task and TaskTrigger models
- trigger execution flow
- duplicate-task prevention
- task authorization and tenant isolation
- overdue calculation
- Socket.IO task events
- verification performed

## Prompt 14

Implement email templates and pipeline email triggers for LeadFlow using Resend.

Context:
- LeadFlow is a MERN stack application for a multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Authentication uses JWT in an HTTP-only cookie.
- Multi-tenancy is mandatory.
- Existing Lead model has:
  brokerageId
  firstName
  lastName
  email
  assignedAdvisorId
  status
  version
- Existing pipeline statuses:
  NEW
  CONTACTED
  QUALIFIED
  APPLICATION
  WON
  LOST
- Existing lead status endpoint:
  PATCH /api/leads/:id/status
- Existing task trigger system runs after successful pipeline status changes.
- Existing Socket.IO brokerage rooms and centralized socket events already exist.
- Existing User model supports advisor and client roles.
- Existing tenant isolation and RBAC utilities must be reused.
- Do not modify previous PROMPTS.md entries.

Goal:
Allow brokerage admins to create and edit email templates and link one template to each pipeline stage. When a lead enters a stage, render the configured template and send the email asynchronously.

Email provider:
- Use Resend.
- Add the required dependency if it is not already installed.
- Keep the Resend API key server-side only.
- Never expose the API key to the frontend.
- Add these environment variables to server/.env.example:

RESEND_API_KEY=
EMAIL_FROM=

Do not add real credentials to source control.

Requirements:

1. Create an EmailTemplate model with at minimum:
   - brokerageId
   - name
   - subject
   - body
   - stage
   - isActive
   - timestamps

2. Each template belongs to exactly one brokerage.

3. Stage must be one of:
   NEW
   CONTACTED
   QUALIFIED
   APPLICATION
   WON
   LOST

4. Keep the MVP simple:
   - allow at most one active email template linked to a given pipeline stage per brokerage.
   - if another active template already exists for the same brokerage and stage, return 409.

5. Brokerage admins can:
   - create templates
   - list templates
   - update templates
   - activate/deactivate templates
   - delete templates

6. Platform admins may manage templates across brokerages.

7. Advisors and clients must not manage email templates.

8. Create template endpoints:

   POST   /api/brokerages/:id/email-templates
   GET    /api/brokerages/:id/email-templates
   GET    /api/brokerages/:id/email-templates/:templateId
   PATCH  /api/brokerages/:id/email-templates/:templateId
   DELETE /api/brokerages/:id/email-templates/:templateId

9. Validate:
   - name required, trimmed, reasonable maximum length
   - subject required
   - body required
   - stage required and valid
   - brokerage must exist

10. Do not accept brokerageId from the request body.
    Determine ownership from the authorized brokerage context and URL.

11. Support these template placeholders:
    {{clientName}}
    {{advisorName}}

12. Template rendering:
    - replace placeholders with actual values at send time.
    - missing advisor should render as an empty string or safe fallback.
    - do not evaluate arbitrary JavaScript or expressions inside templates.
    - do not create a general-purpose template language.

13. Create a small email service that:
    - initializes Resend from RESEND_API_KEY.
    - sends an email using EMAIL_FROM.
    - accepts recipient, subject, and rendered body.
    - never logs API keys.

14. When a lead successfully enters a pipeline stage through:
    PATCH /api/leads/:id/status

    find the active email template for:
    - the lead's brokerage
    - the new stage

15. If an active template exists:
    - render the template
    - send it to the lead's email
    - use the assigned advisor's name when available.

16. If no template exists for that stage:
    - do nothing.
    - the lead status update must still succeed.

17. Email sending must happen asynchronously and must not block or fail the lead status update.

18. If Resend/email sending fails:
    - log the failure appropriately.
    - do not roll back the lead status.
    - do not crash the server.

19. Create a lightweight email-job/background service appropriate for the current MVP.
    Do not introduce Redis/BullMQ.

20. Prevent duplicate email sends caused by the same successful stage transition being processed multiple times.
    Use the existing lead version/status transition information or an email-delivery record with a unique constraint.
    Do not send the same stage-transition email twice for the same lead/version/template combination.

21. Create an EmailDelivery model if needed with useful fields such as:
    - brokerageId
    - leadId
    - templateId
    - stage
    - leadVersion
    - recipient
    - status
    - sentAt
    - failureReason
    - timestamps

22. Email delivery status may be:
    PENDING
    SENT
    FAILED

23. Preserve tenant isolation for email templates and delivery records.

24. Never expose email delivery records belonging to another brokerage.

25. If implementing email delivery APIs, restrict them appropriately:
    - brokerageAdmin/platformAdmin may inspect deliveries for their brokerage.
    - advisors/clients do not need delivery-management access for this MVP.

26. Do not implement:
    - marketing campaigns
    - scheduled newsletters
    - HTML email builder
    - attachments
    - bulk email
    - arbitrary recipient entry
    - frontend UI
    - OAuth
    - Redis/BullMQ

27. Email should only be triggered by an actual successful pipeline stage change.

28. A status update that fails due to:
    - authentication
    - authorization
    - validation
    - tenant isolation
    - stale version
    - database failure

    must not send an email.

29. Preserve all existing:
    - authentication
    - RBAC
    - tenant isolation
    - Lead CRUD
    - Tally webhook
    - Socket.IO
    - Lead-to-client conversion
    - documents
    - advisor management
    - task triggers

30. Add useful indexes/unique constraints for:
    - brokerageId
    - stage
    - active template per brokerage/stage
    - lead/template/version delivery deduplication

31. Run syntax checks and application import/startup checks after implementation.

Return a concise summary of:
- files created/changed
- email template model
- supported placeholders
- Resend integration
- stage-trigger flow
- async sending approach
- duplicate email prevention
- tenant isolation
- verification performed

## Prompt 15

Implement the LeadFlow dashboard pipeline counts API.

Context:
- LeadFlow is a MERN stack multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Authentication uses JWT in an HTTP-only cookie.
- Multi-tenancy is mandatory.
- Existing Lead model contains:
  brokerageId
  firstName
  lastName
  email
  phone
  source
  status
  assignedAdvisorId
  clientId
  convertedAt
  version
  timestamps
- Existing pipeline statuses:
  NEW
  CONTACTED
  QUALIFIED
  APPLICATION
  WON
  LOST
- Existing tenant isolation utilities must be reused.
- Do not modify previous PROMPTS.md entries.

Goal:
Create a fast dashboard API that returns current pipeline counts for the authenticated user's brokerage.

Requirements:

1. Create a dashboard service and controller.

2. Create endpoint:

   GET /api/dashboard/pipeline

3. Access:
   - platformAdmin: may request counts for a brokerage using a query parameter:
     ?brokerageId=<id>
   - brokerageAdmin: automatically uses their own brokerage.
   - advisor: automatically uses their own brokerage.
   - client: must receive 403.

4. Never trust brokerageId from the request body.

5. For brokerageAdmin and advisor:
   - derive brokerageId from req.user.brokerageId.
   - ignore any brokerageId query parameter they provide.

6. For platformAdmin:
   - brokerageId query parameter is required.
   - validate that the brokerage exists.
   - return 404 if the brokerage does not exist.

7. Return counts for every pipeline stage:

   {
     "NEW": number,
     "CONTACTED": number,
     "QUALIFIED": number,
     "APPLICATION": number,
     "WON": number,
     "LOST": number
   }

8. Counts must be calculated from the Lead collection and scoped strictly by brokerageId.

9. Use a single efficient MongoDB aggregation/grouping query rather than running six separate count queries.

10. The API must not return leads or unnecessary data.
    Return only pipeline counts.

11. Counts must reflect the current database state.
    Do not introduce application-level caching for this MVP.

12. The dashboard should therefore never intentionally serve stale cached counts.

13. Add useful indexes if needed.
    At minimum, consider an index supporting:
    - brokerageId
    - status

14. Preserve tenant isolation:
    - Brokerage A must never see Brokerage B's counts.
    - An advisor must never be able to request another brokerage's counts by changing a query parameter.
    - Platform admin may explicitly request another brokerage.

15. Handle a brokerage with no leads by returning zero for every stage.

16. Handle only valid existing pipeline statuses.
    Do not create additional pipeline stages.

17. Keep the implementation simple.
    Do not introduce:
    - Redis
    - BullMQ
    - WebSockets specifically for dashboard counts
    - analytics/event-sourcing
    - complex caching
    - frontend UI

18. The endpoint should work with the existing authentication and RBAC middleware.

19. Follow the existing project naming and folder conventions.

20. Add the dashboard route to the existing Express application.

21. Run syntax checks and application import/startup checks after implementation.

22. Verify tenant isolation and role behavior at the API/service level where practical.

Return a concise summary of:
- files created/changed
- endpoint
- response shape
- aggregation approach
- role behavior
- tenant isolation
- indexes added
- verification performed

## Prompt 16

Implement and fix tenant-scoped duplicate lead detection in LeadFlow.

Context:
- LeadFlow is a MERN stack multi-tenant mortgage brokerage CRM.
- Backend uses Node.js, Express.js, MongoDB, and Mongoose.
- Architecture: Route -> Controller -> Service -> Model/DB.
- Controllers must remain thin.
- Existing roles:
  platformAdmin
  brokerageAdmin
  advisor
  client
- Authentication uses JWT in an HTTP-only cookie.
- Multi-tenancy is mandatory.

Existing Lead model contains:
- brokerageId
- firstName
- lastName
- email
- phone
- normalizedEmail
- normalizedPhone
- source
- status
- assignedAdvisorId
- clientId
- convertedAt
- version
- timestamps

Existing duplicate-related behavior:
- normalizedEmail is generated from email using trim + lowercase.
- normalizedPhone is generated from phone by keeping digits and an optional leading +.
- The current createLead service does not yet perform a duplicate lookup.
- Duplicate detection is required for leads.

Important:
- Do not modify previous PROMPTS.md entries.
- Do not redesign the Lead model unnecessarily.
- Preserve all existing authentication, RBAC, tenant isolation, pipeline, Tally, Socket.IO, client conversion, documents, advisor, task, email, and dashboard behavior.

Goal:
Before creating a new Lead, detect whether the same person is already known within the same brokerage.

Requirements:

1. Update the manual Lead creation flow:

   POST /api/leads

   Before creating a new Lead, check for an existing Lead belonging to the authenticated user's brokerage.

2. Duplicate matching rules:

   A lead is considered a duplicate when either:

   - normalizedEmail matches an existing lead in the same brokerage
   OR
   - normalizedPhone matches an existing lead in the same brokerage.

3. Email matching:
   - Normalize by trim + lowercase.
   - Do not perform case-sensitive duplicate checks.

4. Phone matching:
   - Use the existing normalizedPhone behavior.
   - Do not treat an absent/empty phone value as a duplicate.

5. Missing fields:
   - If only email is provided, check email.
   - If only phone is provided, check phone.
   - If neither is provided, do not perform a duplicate contact lookup.

6. Tenant isolation:
   - Duplicate detection must ALWAYS include brokerageId.
   - A matching email/phone belonging to Brokerage A must not prevent creation of the same person in Brokerage B.
   - Never perform a global email or phone duplicate lookup.

7. If a duplicate is found:
   - Do not create a new Lead.
   - Return HTTP 409 Conflict.
   - Return a clear response such as:

     {
       "message": "Duplicate lead detected.",
       "duplicateLeadId": "<existing lead id>"
     }

   - Do not expose unnecessary information about the existing lead.

8. Check both email and phone when both are supplied.
   - If either matches, treat it as a duplicate.
   - Returning the existing lead ID is sufficient.

9. Keep duplicate detection in the service layer.
   - Do not put business logic in the controller.
   - Reuse the existing lead service architecture.

10. Performance:
    - Use normalized fields for the lookup.
    - Scope the query by brokerageId.
    - Use an efficient MongoDB query.
    - Avoid loading all brokerage leads into application memory.

11. Database indexes:
    - Preserve the existing indexes.
    - Add or adjust indexes only if useful for the brokerage-scoped duplicate lookup.
    - If adding indexes, prefer compound indexes involving brokerageId with normalizedEmail and normalizedPhone.
    - Do not make email or phone globally unique.
    - Do not make normalizedEmail or normalizedPhone globally unique.

12. Race-condition consideration:
    - Consider the possibility that two identical lead creation requests arrive at nearly the same time.
    - Avoid introducing an overly complex distributed locking system.
    - If the implementation can safely enforce brokerage-scoped uniqueness at the database level without breaking the requirement that duplicate matching is email OR phone, do so.
    - Otherwise, keep the normal lookup-based MVP implementation and clearly document the remaining race-condition limitation in the implementation summary.

13. Tally integration:
    - Inspect the existing Tally lead ingestion flow.
    - It already has duplicate-person detection.
    - Ensure its duplicate matching remains brokerage-scoped and consistent with the manual Lead creation rules:
      normalized email OR normalized phone.
    - Do not break Tally webhook idempotency.
    - Do not create a second Lead when the same Tally event/person is received.

14. Important distinction:
    - Tally webhook event idempotency and duplicate-person detection are separate concerns.
    - Keep both mechanisms working.

15. Do not change pipeline status behavior.
    - A duplicate request must not trigger:
      - pipeline updates
      - task triggers
      - email triggers
      - Socket.IO lead updates
      - client conversion
    - Since no new Lead is created, no downstream Lead-created behavior should occur.

16. Error handling:
    - Add appropriate controller error handling for the new duplicate error.
    - Return 409 Conflict for duplicate detection.
    - Preserve existing validation/error behavior.

17. Do not implement:
    - fuzzy matching
    - name similarity matching
    - address matching
    - AI duplicate detection
    - global deduplication
    - merging leads
    - automatic lead deletion
    - Redis
    - BullMQ

18. Verification:
    Verify at minimum:

   Test A:
   Brokerage A already has:
   email = tenant.a@test.com

   Create another lead in Brokerage A with:
   email = tenant.a@test.com
   different phone

   Expected:
   409 Duplicate lead detected.
   No new Lead created.

   Test B:
   Brokerage A already has:
   phone = 9000000001

   Create another lead in Brokerage A with:
   different email
   phone = 9000000001

   Expected:
   409 Duplicate lead detected.
   No new Lead created.

   Test C:
   Brokerage A has:
   email = tenant.a@test.com

   Brokerage B creates:
   email = tenant.a@test.com

   Expected:
   Lead creation succeeds.
   Tenant A's lead does not affect Tenant B.

   Test D:
   Create a lead without email and with a unique phone.

   Expected:
   Lead creation succeeds.

   Test E:
   Create a lead without phone and with a unique email.

   Expected:
   Lead creation succeeds.

   Test F:
   Create a lead with neither email nor phone.

   Expected:
   Lead creation follows existing validation/business rules and does not perform a duplicate lookup.

   Test G:
   Send the same Tally event twice.

   Expected:
   Existing Tally idempotency behavior remains intact.

   Test H:
   Send a Tally lead with an email or phone matching an existing Lead in the same brokerage.

   Expected:
   Existing duplicate-person behavior remains intact and no duplicate Lead is created.

19. Inspect the existing code before modifying it.
    Make the smallest safe changes necessary.

20. Run:
    - JavaScript syntax checks
    - application import/startup check
    - relevant API verification
    - any existing tests if present

21. Do not modify frontend files.

Return a concise summary of:
- root cause of the duplicate creation bug
- files changed
- duplicate matching logic
- tenant isolation behavior
- 409 response behavior
- database indexes changed
- Tally behavior preserved
- race-condition handling/trade-off
- verification performed

## Prompt 17 

Audit the entire server route structure for nested Express routers.

We just found a bug where routers mounted under a parameterized parent route such as:

router.use("/:id/task-triggers", taskTriggerRoutes);
router.use("/:id/email-templates", emailTemplateRoutes);

were created with Router() instead of Router({ mergeParams: true }), causing req.params.id to be undefined inside the child router and resulting in "Invalid ID." errors.

Audit ALL server route files and their mount points for this class of bug.

Requirements:
1. Inspect every route file under server/src/routes.
2. Inspect where each route is mounted in the parent routes/app.
3. Identify child routers mounted under parameterized parent paths such as "/:id/...", "/:brokerageId/...", etc.
4. Check whether the child router actually reads those parent route parameters through req.params.
5. Where required, change:
   Router()
   to:
   Router({ mergeParams: true })
6. Do NOT add mergeParams blindly to every router. Only change routers where parent route parameters need to be available.
7. Do not change API paths, controller behavior, authorization logic, business logic, or unrelated code.
8. Check for the same issue across advisors, task-triggers, email-templates, and any other nested routers.
9. After making the changes, review the route mounting hierarchy once more to ensure there are no remaining parent-param propagation issues.
10. Keep the changes minimal and focused on this bug class.

Do not refactor unrelated code.

## Prompt 18 

Fix the LeadFlow lead contact-method validation bug.

Context:
A lead must always have at least one usable contact method because an advisor needs a way to contact the lead.

Current required behavior:
- email OR phone must be provided
- email + phone is allowed
- email only is allowed
- phone only is allowed
- neither email nor phone must be rejected

Apply this rule consistently to:
1. Manual lead creation via POST /api/leads
2. Tally/external lead ingestion

Implementation requirements:
1. Inspect the existing lead creation flow, lead service, controller, model validation, and Tally service before making changes.
2. Reuse the existing email/phone normalization utilities from the duplicate-detection implementation.
3. Centralize the "at least one contact method" validation if there is a clean existing utility/service location for it. Do not duplicate the same validation logic unnecessarily.
4. Preserve the existing tenant-scoped duplicate detection behavior:
   - duplicate matching is still brokerage-scoped
   - email OR normalized phone can identify a duplicate
   - no global uniqueness should be introduced
5. Preserve existing Tally webhook idempotency and form-to-brokerage mapping.
6. Do not change unrelated APIs or frontend code.
7. Keep the current API architecture: route → controller → service → model/utility.
8. Return a clear 400 validation response when both contact methods are missing.
9. Add/update focused tests if the project already has a test setup; otherwise do not introduce a new testing framework just for this fix.
10. Do not overengineer this fix.

Expected behavior examples:
- { email: "test@example.com", phone: "1234567890" } → allowed
- { email: "test@example.com" } → allowed
- { phone: "1234567890" } → allowed
- { email: "", phone: "" } → rejected
- { } → rejected

After implementation:
- Review the changed files for consistency.
- Do not modify unrelated functionality.
- Do not update documentation or PROMPTS.md as part of this task.

## Prompt 19

We have a regression in manual lead creation.

Before the recent contact-method validation fix, this exact payload successfully created a lead:

{
  "firstName": "Pipeline",
  "lastName": "Test",
  "email": "pipeline@test.com",
  "phone": "9000000011",
  "source": "manual"
}

Now the same type of payload returns:

{
  "message": "Lead validation failed."
}

The controller hides the actual Mongoose ValidationError behind the generic 422 response.

Do NOT change functionality yet.

Inspect the current lead creation flow and identify the exact Mongoose validation error and field that is failing.

Check:
- server/src/services/lead.service.js
- server/src/models/lead.model.js
- server/src/utils/lead-identity.js
- any recent changes related to contact-method validation

Temporarily add useful server-side debugging if necessary, or otherwise inspect the error object, so we can determine:
1. Which field fails validation
2. What value is being passed to that field
3. Why it worked before the recent contact-method validation change

Do not implement a fix yet.
Do not modify unrelated functionality.

Return the exact root cause and the specific file/line responsible.

## Prompt 20

In server/src/controllers/lead.controller.js, temporarily improve the generic Mongoose ValidationError handling for the create-lead debugging case.

When error.name === "ValidationError", log the actual validation details on the server:
- error.message
- Object.keys(error.errors)
- for each error.errors[field], log:
  - field
  - kind
  - path
  - value
  - message

Do not expose sensitive data in the API response.
Keep the existing 422 response:
{
  "message": "Lead validation failed."
}

Do not change lead creation logic, model validation, contact-method validation, duplicate detection, Tally behavior, or any other functionality.

This is temporary debugging only. Tell me exactly where you added the logging.

## Prompt 21

Remove the temporary ValidationError debugging logs that were added in:

server/src/controllers/lead.controller.js

Restore the previous generic ValidationError handling:

if (error.name === "ValidationError") {
  return res.status(422).json({ message: "Lead validation failed." });
}

Do not change any lead creation logic, validation logic, duplicate detection, Tally behavior, or unrelated functionality.

After the change, run the existing syntax/import checks and confirm only the temporary debugging logs were removed.

## Prompt 22

Fix the missing email trigger for newly created NEW leads.

Problem:
A new lead can be successfully created with status NEW, but the active NEW email template is not triggered.

Observed during testing:
- POST /api/leads successfully creates the lead with status NEW.
- No email was received.
- No Resend delivery was created.
- No email-related server output appeared.

Existing behavior:
Email triggers already work from successful pipeline status transitions. Preserve that behavior.

Required behavior:
Whenever a lead is successfully created in the NEW stage, trigger the active NEW-stage email template asynchronously.

This must work for:
1. Manual lead creation
2. Tally/external lead ingestion

Implementation requirements:
1. Inspect the existing email-trigger service and the current lead creation flow before changing code.
2. Reuse the existing email trigger infrastructure. Do not create a second email-sending implementation.
3. Trigger the email only after the lead has been successfully persisted.
4. Email sending must be asynchronous/non-blocking. A Resend/provider failure must NOT cause lead creation to fail.
5. If there is no active NEW template, lead creation must still succeed.
6. Preserve the existing email delivery deduplication behavior.
7. Preserve tenant isolation.
8. Preserve existing CONTACTED/other pipeline-stage email triggers.
9. Apply the same behavior to Tally-created NEW leads without breaking webhook idempotency.
10. Do not add Redis, queues, or new infrastructure.
11. Do not modify frontend code.
12. Do not modify unrelated functionality.
13. Do not update PROMPTS.md.

Important:
Do not simply call the existing status-transition controller from lead creation. Use the existing service-level email trigger mechanism at the appropriate service layer.

After implementation:
- Run syntax/import checks.
- Explain exactly where the NEW-stage trigger is invoked for manual and Tally lead creation.
- Confirm that email failures cannot roll back/fail lead creation.

## Prompt 23

We fixed the NEW-stage email trigger so that creating a lead with status NEW should asynchronously queue/send the active NEW email template.

The fix passed syntax/import checks, but I manually created a fresh NEW lead after the fix and still received no email. Resend API key is valid and was recently used, but the Resend dashboard has no new email entry for this test.

Do a focused end-to-end investigation of the NEW lead email flow.

Trace the exact execution path:

1. Manual POST /api/leads
2. lead.service.js lead creation
3. queueStageEmail()
4. email-trigger.service.js
5. sendStageEmail()
6. active NEW email template lookup
7. EmailDelivery creation/update
8. Resend API call
9. error handling/logging

Do NOT redesign the email system and do NOT modify unrelated functionality.

First inspect the existing implementation and identify exactly where execution may be stopping.

Then make the smallest necessary fix so that:
- Creating a valid lead with status NEW triggers the active NEW-stage email.
- Email sending remains asynchronous and must not delay/fail lead creation.
- Missing template remains a no-op.
- Missing lead email remains a no-op.
- Resend/provider failure must not fail lead creation.
- EmailDelivery should accurately record SENT or FAILED.
- Existing pipeline-stage email behavior must remain unchanged.
- Existing deduplication must remain unchanged.

Add only temporary diagnostic logging if absolutely necessary, and remove noisy debug logs after fixing.

After the fix, run syntax/import checks for all changed files.

Do not change the API contract or introduce Redis/BullMQ.

## Prompt 24

We need to switch LeadFlow's email transport from Resend to Gmail SMTP for the assignment/demo.

IMPORTANT:
- Do NOT redesign the existing email system.
- Do NOT modify email templates, email triggers, EmailDelivery schema, deduplication logic, pipeline status behavior, or lead creation behavior unless absolutely required for the SMTP transport.
- Do NOT introduce Redis, BullMQ, queues, or any new infrastructure.
- Keep email sending asynchronous.
- Do NOT expose or log SMTP credentials.
- Do NOT change API contracts.
- Do NOT touch frontend code.
- Do NOT modify unrelated files.

Current email architecture:
Lead status/creation
→ email-trigger.service.js
→ sendStageEmail()
→ email.service.js
→ EmailDelivery
→ external email provider

The current provider is Resend. We now want Gmail SMTP instead.

Environment variables already added to server/.env:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<configured locally>
SMTP_PASSWORD=<configured locally>
EMAIL_FROM=LeadFlow <configured locally>

The actual credentials exist only in server/.env.
NEVER print, expose, commit, or hardcode their values.

TASKS:

1. Inspect the current email implementation first.

2. Identify exactly where Resend is currently initialized and used.

3. Replace ONLY the provider/transport layer with Gmail SMTP using Nodemailer.

Use:
- smtp.gmail.com
- port 587
- secure false
- authentication from SMTP_USER and SMTP_PASSWORD

Use the existing EMAIL_FROM environment variable as the sender.

4. Add Nodemailer as a server dependency if it is not already installed.

5. Update email.service.js so the existing email-trigger service can continue calling the same email sending function without needing architectural changes.

The existing callers should not need to know whether the provider is Resend or SMTP.

6. Preserve the existing behavior:
- Email templates continue working exactly as before.
- {{clientName}} and {{advisorName}} placeholders continue working.
- NEW-stage email trigger continues working.
- Pipeline-stage email triggers continue working.
- EmailDelivery records continue being created.
- Successful sends continue resulting in SENT.
- Failed sends continue resulting in FAILED.
- Missing template remains a no-op.
- Missing lead email remains a no-op.
- Duplicate delivery protection remains unchanged.
- Email/provider failure must NEVER fail or rollback lead creation/status transition.
- Email sending must remain asynchronous.

7. Remove the temporary diagnostic/debug logging that was added while investigating the NEW-stage email trigger issue.

Specifically:
- Remove noisy temporary logs that were only added for debugging the email flow.
- Keep useful production-level error logging for actual SMTP/email failures.
- Never log SMTP_PASSWORD, API keys, email credentials, or authentication details.

8. Remove the active Resend dependency/configuration from the email sending path.

If the Resend package is no longer used anywhere after the migration, remove it from package.json/package-lock.json.

Do NOT remove the old RESEND_API_KEY or other Resend variables from .env.example unless you confirm they are no longer needed; if appropriate, replace the provider-specific configuration with the SMTP variables in .env.example.

The final active email path must be:

LeadFlow
→ existing email trigger system
→ existing email service
→ Gmail SMTP
→ recipient

9. Add clear configuration validation if appropriate:
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD
- EMAIL_FROM

Do not validate/log the actual secret values.

10. Before finishing:
- Run syntax checks for all changed server JavaScript files.
- Run the application import/startup check.
- Confirm there are no remaining active Resend imports/usages in the email sending path.
- Confirm there are no temporary debug logs remaining.
- Confirm no secrets are tracked by git.

11. Do NOT modify any unrelated backend functionality.

At the end, report:
- files changed
- what changed in each file
- whether Resend is completely removed from the active email path
- whether temporary debug logs were removed
- syntax/import verification results
- any remaining manual test required

Do NOT make a commit.

# Prompt 25

We are now starting the LeadFlow frontend.

IMPORTANT:
- Work only inside the client/ directory.
- Do NOT modify server/ files.
- Do NOT invent backend APIs.
- Inspect the existing client project before making changes.
- Follow the existing LeadFlow React skill, design-craft skill, and tailwind-best-practices skill.
- Keep the implementation practical and assignment-focused. Do not overengineer.
- Use JavaScript, not TypeScript.
- Do not add unnecessary libraries.
- Do not add animations unless they provide a clear UX benefit.
- Do not create a large custom design system.
- Keep components reusable but avoid premature abstraction.

TECH STACK:
- React
- Vite
- React Router
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- Socket.IO client later

BACKEND CONTRACT:
The backend already exists and must be treated as the source of truth.

Roles:
- platformAdmin
- brokerageAdmin
- advisor
- client

Authentication:
- JWT is stored in an HTTP-only cookie.
- Frontend must never read/store the JWT itself.
- Authentication is checked through:
  GET {{base_url}}/api/auth/me
- Login:
  POST {{base_url}}/api/auth/login
- Logout:
  POST {{base_url}}/api/auth/logout

Existing important backend routes include:

Auth:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Leads:
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PATCH  /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:id/status
POST   /api/leads/:id/convert-to-client

Dashboard:
GET /api/dashboard/pipeline

Tasks:
GET   /api/tasks
GET   /api/tasks/:id
PATCH /api/tasks/:id
PATCH /api/tasks/:id/complete

Client:
GET /api/client/case
GET /api/client/documents
POST /api/client/documents
GET /api/client/documents/:id

Advisor management:
GET /api/brokerages/:id/advisors
GET /api/brokerages/:id/advisors/available
POST /api/brokerages/:id/advisors
PATCH /api/brokerages/:id/advisors/:advisorId

Email templates:
GET /api/brokerages/:id/email-templates
POST /api/brokerages/:id/email-templates
PATCH /api/brokerages/:id/email-templates/:templateId
DELETE /api/brokerages/:id/email-templates/:templateId

Task triggers:
GET /api/brokerages/:id/task-triggers
POST /api/brokerages/:id/task-triggers
PATCH /api/brokerages/:id/task-triggers/:triggerId
DELETE /api/brokerages/:id/task-triggers/:triggerId

FIRST OBJECTIVE:

Build the frontend foundation required for all later screens.

1. Inspect the current client/package.json and existing source files.

2. Configure/install only the dependencies actually required for:
- React Router
- TanStack Query
- Axios
- Zustand
- Tailwind CSS if not already configured

3. Create a clean frontend structure similar to:

client/src/
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── utils/
├── main.jsx
├── App.jsx
└── index.css

Adjust the structure if the existing project already has equivalent files.

4. Create a centralized Axios API client.

Requirements:
- baseURL must come from an environment variable.
- Use credentials so HTTP-only cookies are sent.
- Do not store JWT tokens in localStorage/sessionStorage.
- Provide a clean place for common API error handling.
- Do not hardcode localhost URLs throughout components.

Use a frontend env variable such as:
VITE_API_BASE_URL

5. Create an auth service for:
- login
- logout
- getCurrentUser

6. Create an authentication store using Zustand.

The store should represent:
- current user
- authentication loading state
- authenticated/unauthenticated state
- initialization/checking state

Do not persist the JWT because the JWT is HTTP-only.

7. Create a bootstrap/auth initialization flow.

When the application starts:
- call GET /api/auth/me
- if authenticated, store the returned user
- if unauthenticated, mark the user as logged out
- avoid flashing protected pages while authentication is still being determined

8. Create route protection.

Implement:
- public route for /login
- protected application routes
- role-aware protection where useful

At minimum:
- unauthenticated users should be redirected to /login
- authenticated users should not remain on /login unnecessarily
- client users should not access brokerage/admin/advisor screens
- non-client users should not access the client portal

Do not build every page yet. Placeholder pages are acceptable.

9. Create the main application layout.

Build a professional but simple CRM-style layout:
- sidebar/navigation
- top header
- main content area
- user name/role display
- logout action

Navigation should be role-aware.

Do not create fake navigation destinations that do not exist yet unless they are clearly placeholder routes.

10. Create placeholder routes/pages for the upcoming major screens:

For brokerage/admin/advisor:
- /dashboard
- /leads
- /tasks

For brokerage admin:
- /advisors
- /email-templates
- /task-triggers

For client:
- /client/case
- /client/documents

For platform admin:
- create a minimal placeholder dashboard route for now.

11. Build the Login page.

Requirements:
- email
- password
- submit button
- loading state
- server error display
- accessible labels
- sensible validation
- responsive layout
- clean SaaS/CRM visual hierarchy
- do not over-design it

On successful login:
- update auth state
- redirect the user based on role
- brokerage users should go to /dashboard
- client users should go to /client/case

12. Handle API errors consistently.

At minimum support:
- 401 unauthenticated
- 403 forbidden
- 404 not found
- 409 conflict
- 422 validation error
- 500/server error

Do not expose raw Axios error objects to users.

13. Add useful loading and empty states where applicable.

14. Keep accessibility in mind:
- semantic HTML
- labels
- keyboard navigation
- visible focus states
- buttons should have clear labels
- do not rely on color alone for important state

15. Tailwind:
- use the existing Tailwind configuration if present
- use consistent spacing and typography
- avoid arbitrary values unless genuinely necessary
- avoid giant one-off class strings when a small reusable component makes sense
- do not build a full design system yet

16. Verify:
- npm install succeeds
- npm run build succeeds
- no ESLint/syntax errors if linting exists
- application starts correctly
- login page renders
- unauthenticated access redirects to /login
- auth initialization works
- logout works
- no JWT is stored in browser storage
- no backend files were modified

IMPORTANT:
Do not implement Dashboard, Leads Kanban, Lead Detail, Tasks, Documents, or advanced realtime behavior in this prompt. Only create the foundation and placeholder routes required for them.

At the end, report:
- files created/changed
- dependencies added
- routes created
- auth flow implemented
- verification results
- any manual test I should perform

## Prompt 26

Now implement the first real LeadFlow product screens:

1. Dashboard
2. Leads Kanban board
3. Lead creation
4. Lead detail view
5. Pipeline status movement
6. Basic advisor assignment

IMPORTANT:
- Work ONLY inside client/.
- Do NOT modify server/.
- Do NOT invent or change backend APIs.
- Use the existing backend contract.
- Use the available LeadFlow React, design-craft, and tailwind-best-practices skills.
- Keep the implementation focused on the assignment MVP.
- Do not add unnecessary libraries.
- Do not implement advanced analytics.
- Do not implement drag-and-drop unless it can be done cleanly without adding unnecessary complexity. Buttons/dropdowns for status movement are acceptable for this iteration.
- Do not build realtime Socket.IO yet. We will add it separately after the core UI works.
- Do not implement tasks/email templates/client portal/documents in this prompt.
- Do not commit.

EXISTING BACKEND CONTRACT

Dashboard:
GET {{base_url}}/api/dashboard/pipeline

Response:
{
  "NEW": number,
  "CONTACTED": number,
  "QUALIFIED": number,
  "APPLICATION": number,
  "WON": number,
  "LOST": number
}

Leads:
GET    {{base_url}}/api/leads
GET    {{base_url}}/api/leads/:id
POST   {{base_url}}/api/leads
PATCH  {{base_url}}/api/leads/:id
DELETE {{base_url}}/api/leads/:id
PATCH  {{base_url}}/api/leads/:id/status

Lead statuses:
NEW
CONTACTED
QUALIFIED
APPLICATION
WON
LOST

Lead creation requires at least one:
- email
- phone

Duplicate detection is backend-controlled.

Duplicate response:
HTTP 409
{
  "message": "Duplicate lead detected.",
  "duplicateLeadId": "<existing lead id>"
}

Status updates use optimistic concurrency.

Status request requires:
{
  "status": "CONTACTED",
  "version": 0
}

A stale version returns HTTP 409.

Advisor APIs:
GET {{base_url}}/api/brokerages/:id/advisors
GET {{base_url}}/api/brokerages/:id/advisors/available

The authenticated user's brokerageId should be taken from the auth user returned by /api/auth/me.

Do NOT trust or manually invent brokerage IDs in the UI.

LEAD LIST / KANBAN

Create a proper `/leads` page.

Display six columns:

NEW
CONTACTED
QUALIFIED
APPLICATION
WON
LOST

Each lead card should show useful information such as:
- full name
- email if available
- phone if available
- source
- assigned advisor if available
- current status

Cards should be visually compact enough that multiple leads can be viewed comfortably.

Provide:
- loading state
- error state
- empty state per column
- refresh/retry capability where appropriate

Use TanStack Query for server state.

Do NOT manually duplicate server state in Zustand.

LEAD FILTERING

At minimum provide:
- search by name/email/phone
- status is represented by the Kanban columns

Search can initially be client-side against the currently loaded lead list if the backend does not provide search parameters.

Do not invent query parameters that the backend does not support.

CREATE LEAD

Add a clear "New Lead" action.

Create a modal or dedicated form.

Fields:
- first name
- last name
- email
- phone
- source
- assigned advisor

Validation:
- first name required
- last name required
- at least email OR phone required
- show useful validation messages

Do not perform duplicate detection in the frontend as a replacement for the backend.

Submit:
POST {{base_url}}/api/leads

On success:
- close/reset the form
- invalidate/refetch the leads query
- invalidate/refetch dashboard pipeline counts

On 409:
show a clear message such as:
"This lead already exists in this brokerage."
If duplicateLeadId is available, provide a useful action to open the existing lead if practical.

On 400/422:
display the backend validation message.

LEAD DETAIL

Create:
`/leads/:id`

Fetch:
GET {{base_url}}/api/leads/:id

Display:
- full name
- email
- phone
- source
- current status
- assigned advisor
- notes if available
- created date
- updated date
- version

Provide actions:
- change pipeline status
- assign advisor where the authenticated role is allowed
- convert to client can be shown as a placeholder/action only if the existing backend endpoint can be used safely later; do NOT implement client conversion in this prompt.

STATUS MOVEMENT

Use:
PATCH {{base_url}}/api/leads/:id/status

Request:
{
  "status": "<new status>",
  "version": <current version>
}

Do NOT send status changes through the generic PATCH lead endpoint.

After success:
- update/invalidate the lead query
- invalidate the leads list
- invalidate dashboard pipeline query

Handle HTTP 409 specially.

If a stale version conflict occurs:
show:
"This lead was updated elsewhere. Refreshing the latest version."
Then refetch the lead/list rather than silently overwriting the other update.

Do not implement automatic retry of a conflicting status change.

ADVISOR ASSIGNMENT

For brokerage users where the backend permits assignment:
- load available advisors
- show advisor name/email
- allow selecting an advisor

Use the existing lead update API only if the backend supports assignedAdvisorId through PATCH /api/leads/:id.

Before implementing, inspect the existing backend contract implied by the API behavior already available to the frontend. Do not invent a separate assignment endpoint.

If assignment is not appropriate for a role, hide/disable the control.

ROLE BEHAVIOR

brokerageAdmin:
- dashboard
- leads
- tasks navigation
- advisor management navigation
- email templates navigation
- task triggers navigation

advisor:
- dashboard
- leads
- tasks

platformAdmin:
- dashboard
- leads
- appropriate platform access based on existing backend behavior
- do not expose brokerage-specific controls unless supported by the current backend contract

client:
- must not see brokerage CRM navigation
- client routes remain separate

DASHBOARD

Implement `/dashboard`.

Use:
GET {{base_url}}/api/dashboard/pipeline

Create a clean CRM dashboard with:
- total active pipeline count
- six pipeline status cards/counts
- simple visual representation of pipeline distribution

Do not build charts requiring another library.

Dashboard should communicate:
- NEW
- CONTACTED
- QUALIFIED
- APPLICATION
- WON
- LOST

Clearly distinguish active pipeline stages from terminal WON/LOST stages without inventing business rules not present in the backend.

Use TanStack Query.

When a lead is created or its status changes, invalidate the dashboard query so counts do not remain stale.

DESIGN

Use the design-craft skill for visual hierarchy.

Use tailwind-best-practices for implementation.

Use the existing LeadFlow design tokens from the foundation.

Visual direction:
- professional SaaS CRM
- clean
- compact
- readable
- strong hierarchy
- good spacing
- responsive
- accessible
- desktop-first but usable on smaller screens

Avoid:
- excessive gradients
- unnecessary glassmorphism
- excessive animations
- giant cards
- fake metrics
- decorative elements that do not help the workflow

RESPONSIVE BEHAVIOR

Dashboard:
- cards should wrap cleanly.

Kanban:
- on desktop, six columns can horizontally scroll if necessary.
- do NOT squeeze six columns into unreadable widths.
- on smaller screens, allow horizontal scrolling.

ERROR HANDLING

Handle:
401
403
404
409
422
500

Use the existing shared error handling conventions from the foundation.

Do not show raw Axios errors.

TANSTACK QUERY

Use stable query keys, for example:
- ['dashboard', 'pipeline']
- ['leads']
- ['lead', leadId]
- ['advisors', brokerageId]

Use query invalidation after mutations.

Avoid unnecessary useEffect.

Do not duplicate fetched leads into Zustand.

VERIFICATION

Run:
npm run build

Also verify:
- /login still works
- authenticated users reach /dashboard
- dashboard loads actual backend counts
- /leads loads actual leads
- creating a lead works
- duplicate lead returns a useful UI error
- lead detail opens
- status movement works with version
- stale version 409 is handled
- dashboard count refreshes after status change
- advisor list loads where permitted
- no server files changed

At the end report:
- files changed
- routes/pages added
- API endpoints actually used
- dependencies added, if any
- build result
- manual tests still needed


## Prompt 27

Implement the LeadFlow Tasks and Email Automation frontend.

IMPORTANT:
- Work ONLY inside client/.
- Do NOT modify server/.
- Use existing backend APIs exactly; do not invent endpoints.
- Use the existing LeadFlow React, design-craft, and tailwind-best-practices skills.
- Use TanStack Query for server state.
- Do not add unnecessary dependencies.
- Do not implement Socket.IO yet.
- Do not implement client portal/documents yet.
- Do not commit.

TASKS

Create a real `/tasks` page.

Backend APIs:
GET   {{base_url}}/api/tasks
GET   {{base_url}}/api/tasks/:id
PATCH {{base_url}}/api/tasks/:id
PATCH {{base_url}}/api/tasks/:id/complete

Display:
- task title
- description
- lead
- advisor
- status
- due date
- overdue state
- source pipeline stage

Support:
- TODO / COMPLETED / CANCELLED
- complete task action
- loading/error/empty states
- overdue tasks should be visually prominent
- basic filtering by status

Use TanStack Query and invalidate tasks after mutations.

EMAIL TEMPLATES

Create `/email-templates`.

Backend APIs:
GET    {{base_url}}/api/brokerages/:id/email-templates
POST   {{base_url}}/api/brokerages/:id/email-templates
PATCH  {{base_url}}/api/brokerages/:id/email-templates/:templateId
DELETE {{base_url}}/api/brokerages/:id/email-templates/:templateId

Only brokerage admins should see/manage this UI.

Display:
- template name
- subject
- stage
- active/inactive
- edit/delete actions

Create/edit form:
- name
- subject
- body
- stage
- active state

Supported placeholders:
{{clientName}}
{{advisorName}}

Make the placeholders easy to understand in the UI.

Do not attempt to render/evaluate arbitrary expressions.

Handle backend validation and conflicts clearly.

TASK TRIGGERS

Create `/task-triggers`.

Backend APIs:
GET    {{base_url}}/api/brokerages/:id/task-triggers
POST   {{base_url}}/api/brokerages/:id/task-triggers
PATCH  {{base_url}}/api/brokerages/:id/task-triggers/:triggerId
DELETE {{base_url}}/api/brokerages/:id/task-triggers/:triggerId

Only brokerage admins should manage triggers.

Display:
- pipeline stage
- title
- description
- due-in minutes
- active/inactive
- edit/delete actions

Create/edit form:
- stage
- title
- description
- dueInMinutes
- isActive

Handle HTTP 409 duplicate-trigger errors with a clear message.

ROLE BEHAVIOR

brokerageAdmin:
- can access tasks
- can manage email templates
- can manage task triggers

advisor:
- can access their tasks
- must not see email template/task trigger management

platformAdmin:
- preserve existing role behavior
- do not invent additional brokerage-management APIs

client:
- must not see CRM task/template/trigger pages

DESIGN

Use the existing LeadFlow visual style.

Keep it professional and compact:
- tables/cards where appropriate
- clear status badges
- useful empty states
- responsive layout
- accessible forms
- no unnecessary animations
- no fake data

API/STATE

Create service modules where appropriate:
- task.service.js
- email-template.service.js
- task-trigger.service.js

Use stable TanStack Query keys.

Do not duplicate server state into Zustand.

Use the authenticated user's brokerageId where required.
Do not hardcode brokerage IDs.

ERROR HANDLING

Handle:
401
403
404
409
422
500

Never expose raw Axios errors.

VERIFICATION

Run:
npm run build

Verify:
- tasks page loads real tasks
- completing a task works
- overdue tasks are visually distinct
- email templates load/create/edit/delete
- task triggers load/create/edit/delete
- duplicate task trigger returns a useful UI error
- role-based visibility works
- no server files changed

At the end report:
- files changed
- routes added/updated
- API endpoints used
- build result
- manual tests remaining

## Prompt 28

Implement the LeadFlow Client Portal and Document Management frontend.

IMPORTANT:
- Work ONLY inside client/.
- Do NOT modify server/.
- Use the existing LeadFlow React, design-craft, and tailwind-best-practices skills.
- Use existing backend APIs exactly. Do not invent endpoints.
- Use TanStack Query for server state.
- Do not add unnecessary dependencies.
- Do not implement Socket.IO yet.
- Do not implement advanced document preview/viewer functionality.
- Do not commit.

BACKEND CONTRACT

Client case:
GET {{base_url}}/api/client/case

Client documents:
GET  {{base_url}}/api/client/documents
GET  {{base_url}}/api/client/documents/:id
POST {{base_url}}/api/client/documents

The upload endpoint expects multipart/form-data with the file field used by the existing backend contract.

Supported backend document statuses:
- UPLOADED
- PROCESSING
- APPROVED
- FAILED

The backend performs document processing asynchronously.

CLIENT ROUTES

Implement:

/client/case
/client/documents

These routes must only be accessible to authenticated users with role `client`.

Non-client users must not be able to access the client portal.

CLIENT CASE PAGE

Build a useful `/client/case` page.

Load:
GET {{base_url}}/api/client/case

Display the actual case information returned by the backend.

Do not invent fields that are not returned by the API.

Where appropriate show:
- lead/client name
- email
- phone
- current pipeline status
- assigned advisor
- case information available from the API

If the backend returns a 404 because no case is linked:
show a clear empty state such as:
"No active case is linked to this account."

DOCUMENTS PAGE

Build `/client/documents`.

Load:
GET {{base_url}}/api/client/documents

Display uploaded documents with:
- original filename
- status
- upload date
- checked date when available
- failure reason when available

Use clear status badges.

Status presentation:

UPLOADED:
"Uploaded"

PROCESSING:
"Checking..."

APPROVED:
"Approved"

FAILED:
"Failed"

FAILED documents should display the backend-provided failure reason when available.

DOCUMENT UPLOAD

Provide a clear upload area/button.

Use the existing backend requirements:
- PDF
- JPG/JPEG
- PNG
- maximum 10MB

The backend remains the source of truth for validation.

The frontend may provide helpful client-side validation for:
- file type
- file size

But it must still correctly handle backend validation errors.

Upload using:
POST {{base_url}}/api/client/documents

Use multipart/form-data.

Do not manually set an incorrect Content-Type boundary if Axios/browser can handle it automatically.

After successful upload:
- invalidate/refetch the documents query
- show a success message
- reset the file input

IMPORTANT:
The upload request should not wait for the background document check to finish.

The UI should immediately show the newly uploaded document as:
UPLOADED or whatever status the backend returns.

DOCUMENT PROCESSING UX

Because processing happens in the backend asynchronously, the page should make the state understandable.

For now, without Socket.IO:
- use TanStack Query refetching/polling while documents have status UPLOADED or PROCESSING
- stop polling when all documents reach terminal states APPROVED/FAILED
- do not poll excessively
- keep the implementation simple

Use a reasonable polling interval such as 2–3 seconds.

Do not introduce a separate global polling system.

DOCUMENT DETAIL

If useful, allow clicking a document to view basic metadata using:

GET {{base_url}}/api/client/documents/:id

Do not build a complex document viewer.

Do not expose private R2 URLs unless the backend already provides a safe URL.

Do not attempt to access R2 directly from the browser.

SECURITY / ROLE ISOLATION

Client APIs derive the authenticated client from the HTTP-only JWT cookie.

Do NOT send:
- clientId
- brokerageId
- leadId

from the frontend unless an endpoint explicitly requires it.

Do not allow clients to browse another client's documents.

The backend remains responsible for tenant isolation.

UX

Client portal should feel different from the internal CRM while still using the same LeadFlow visual language.

Create:
- clean client header
- clear case summary
- document checklist/upload area
- document status list
- helpful empty states
- loading states
- error states

Keep it simple and professional.

Avoid:
- excessive animations
- fake document categories
- fake progress percentages
- fake AI verification claims
- unnecessary dashboards

DOCUMENT UPLOAD ACCESSIBILITY

- accessible file input
- clear supported-format text
- visible upload progress/loading state
- disable upload action while uploading
- keyboard accessible controls
- useful error messages

API ERROR HANDLING

Handle:
401
403
404
409
422
500

Do not expose raw Axios errors.

Use the existing error handling patterns from the frontend foundation.

TANSTACK QUERY

Use stable query keys such as:
['client', 'case']
['client', 'documents']
['client', 'document', documentId]

Use query invalidation/refetching after upload.

Do not copy server state into Zustand.

Avoid unnecessary useEffect.

ROLE NAVIGATION

For client users:
- show Client Case
- show Documents
- hide CRM dashboard/leads/tasks/automation navigation

For brokerage users:
- preserve the existing CRM navigation
- do not expose client portal navigation as their primary navigation

Do not break existing role-based routing.

VERIFICATION

Run:
npm run build

Also verify:
- client login still works
- /client/case loads actual backend case data
- /client/documents loads actual documents
- uploading a valid PDF works
- invalid file types are rejected clearly
- files above 10MB are rejected clearly
- newly uploaded documents appear immediately
- PROCESSING state is visible while background checking runs
- APPROVED/FAILED state eventually appears
- FAILED reason is displayed when provided
- non-client users cannot access client routes
- no server files changed

At the end report:
- files changed
- routes added/updated
- API endpoints used
- polling behavior
- build result
- manual tests remaining

## Prompt 29

Implement LeadFlow frontend realtime updates using the existing Socket.IO backend.

IMPORTANT:
- Work ONLY inside client/.
- Do NOT modify server/.
- Use the existing LeadFlow React skill, design-craft, and tailwind-best-practices skills.
- Use the existing Socket.IO backend contract. Do not invent events.
- Do not add unnecessary dependencies.
- Do not create a second global state system for realtime data.
- Use TanStack Query invalidation/refetching as the primary way to synchronize server state.
- Do not commit.

BACKEND REALTIME CONTRACT

The backend already initializes Socket.IO and authenticates connections using the HTTP-only JWT cookie.

Existing events include:

lead:updated
document:updated

The backend already places authenticated tenant users into:
brokerage:<brokerageId>

The frontend must not manually choose or join arbitrary brokerage rooms.

REALTIME CLIENT

1. Add the Socket.IO client dependency if it is not already installed.

2. Create a centralized Socket.IO client/service.

The socket connection should:
- use the existing API/server origin
- send credentials/cookies
- connect only when the user is authenticated
- disconnect cleanly when the user logs out
- avoid duplicate connections during React development/StrictMode
- not create one socket per page/component

3. Integrate realtime into the authenticated application lifecycle.

The socket should be initialized from the authenticated application layer/layout rather than separately from Dashboard, Leads, Documents, etc.

Do not connect on the login page while unauthenticated.

LEAD UPDATES

Listen for:
lead:updated

When received:
- invalidate ['leads']
- invalidate ['dashboard', 'pipeline']
- invalidate the affected ['lead', leadId] query when lead ID is available

Do not manually mutate the entire Kanban state from the socket payload.

Let TanStack Query refetch the authoritative backend state.

This should make:
- Kanban updates
- dashboard counts
- lead detail
stay synchronized.

DOCUMENT UPDATES

Listen for:
document:updated

When received:
- invalidate ['client', 'documents']
- invalidate ['client', 'document', documentId] when document ID is available

This should update:
UPLOADED
→ PROCESSING
→ APPROVED / FAILED

without requiring the client to manually refresh.

POLLING

The Client Documents page currently polls while documents are UPLOADED/PROCESSING.

After realtime is implemented:
- keep the existing polling as a fallback, but reduce unnecessary polling if appropriate
- do not introduce aggressive polling
- realtime should be the primary update mechanism

Do not make the system dependent solely on WebSockets.

CONNECTION STATES

Provide a lightweight connection state if useful:
- connected
- reconnecting/disconnected

Do not create a large notification system.

If the socket disconnects:
- application must continue working normally
- normal TanStack Query/API operations must continue
- do not show intrusive errors

If it reconnects:
- optionally invalidate relevant active queries so the UI catches up with changes missed while disconnected

ROLE / TENANT SAFETY

Do not send brokerageId, clientId, or room identifiers from the frontend to authorize access.

The backend remains responsible for:
- JWT authentication
- brokerage room membership
- tenant isolation

The frontend only connects using the authenticated session.

CLEANUP

Ensure:
- one socket connection per authenticated application session
- listeners are registered once
- listeners are removed on cleanup
- socket disconnects on logout
- no memory leaks
- no duplicate event handling

TANSTACK QUERY

Use the existing query keys created by the frontend:

['dashboard', 'pipeline']
['leads']
['lead', leadId]
['client', 'documents']
['client', 'document', documentId]

Do not introduce duplicate query keys for the same resources.

VERIFICATION

Run:
npm run build

Also verify:
- authenticated CRM user connects successfully
- lead status changed from another request updates the Kanban/dashboard after socket event
- document status updates after backend processing
- client logout disconnects the socket
- unauthenticated user does not maintain a socket connection
- refreshing/reloading still works if Socket.IO is unavailable
- no duplicate socket connections/listeners are created
- no server files changed

At the end report:
- files changed
- dependency changes
- socket lifecycle implementation
- events handled
- TanStack Query invalidations
- build result
- any manual realtime test remaining

## Prompt 30