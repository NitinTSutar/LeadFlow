# LeadFlow - MERN Development Guidelines

## 1. Technology Stack

This project uses:

- React
- Vite
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose

The backend uses ES Modules.

Do not introduce TypeScript unless explicitly requested.

---

## 2. JavaScript Rules

- Use modern JavaScript (ES6+).
- Use `import` / `export`.
- Do not use CommonJS `require()` / `module.exports`.
- Prefer `const` and `let`.
- Never use `var` unless there is a specific technical reason.
- Use async/await for asynchronous operations.
- Handle rejected promises and asynchronous errors properly.
- Avoid deeply nested callbacks.
- Keep functions small and focused.
- Use descriptive variable and function names.
- Avoid unnecessary abstractions.

---

## 3. Backend Architecture

Use this general request flow:

Route
→ Controller
→ Service
→ Model / Database

### Routes

Routes should:

- Define API endpoints.
- Apply relevant middleware.
- Delegate request handling to controllers.

Routes should not contain business logic.

### Controllers

Controllers should:

- Read and validate request data.
- Call the appropriate service.
- Return the HTTP response.

Controllers should remain thin.

### Services

Services contain business logic.

Services should:

- Implement application/business rules.
- Coordinate multiple models when necessary.
- Be reusable by controllers, jobs, or other services where appropriate.

### Models

Mongoose models should:

- Define database schemas.
- Define indexes when appropriate.
- Contain database-related schema configuration.

Do not put large business workflows inside models.

---

## 4. Express Rules

- Use middleware for cross-cutting concerns.
- Use centralized error handling.
- Validate incoming request data.
- Return appropriate HTTP status codes.
- Do not expose stack traces or sensitive internal information in production responses.
- Keep API responses consistent.

---

## 5. MongoDB / Mongoose

- Use Mongoose for MongoDB interaction.
- Define explicit schemas.
- Add indexes where query patterns justify them.
- Avoid unnecessary database queries.
- Avoid fetching entire collections when only a count or subset is required.
- Use projections when appropriate.
- Use transactions when multiple related database operations must be atomic.
- Do not store secrets or credentials in MongoDB unnecessarily.

---

## 6. API Design

Use RESTful API conventions.

Examples:

GET    /api/resource
GET    /api/resource/:id
POST   /api/resource
PATCH  /api/resource/:id
DELETE /api/resource/:id

Use appropriate HTTP status codes.

Examples:

200 - successful request
201 - resource created
204 - successful request with no response body
400 - invalid request
401 - unauthenticated
403 - unauthorized
404 - resource not found
409 - conflict
422 - validation failure
500 - unexpected server error

---

## 7. Authentication and Authorization

- Authentication and authorization must remain separate concepts.
- Authentication determines who the user is.
- Authorization determines what the user is allowed to do.
- Never trust role information supplied directly by the client.
- Never trust a brokerage/tenant ID supplied by the client when it can be derived from the authenticated user.
- Sensitive authentication data must not be exposed in API responses.
- Prefer HTTP-only cookies for browser authentication when the project architecture requires cookie-based JWT authentication.

---

## 8. Multi-Tenant Data Safety

LeadFlow is a multi-tenant application.

Any tenant-owned resource must be scoped to the authenticated user's brokerage/tenant.

Examples include:

- Leads
- Clients
- Documents
- Tasks
- Advisors
- Email templates
- Integrations

Never allow a user from one brokerage to access another brokerage's data by guessing or modifying an ID.

Tenant filtering must happen on the backend.

Do not rely only on frontend filtering for tenant isolation.

---

## 9. React Rules

- Use functional components.
- Use React hooks appropriately.
- Keep components focused and reusable.
- Avoid unnecessarily large components.
- Keep business logic out of presentation components when practical.
- Avoid unnecessary re-renders.
- Do not introduce global state when local state is sufficient.
- Use reusable components for repeated UI patterns.

---

## 10. React State

Use the simplest state solution appropriate for the problem.

Prefer:

1. Local component state for local UI state.
2. Context only when shared context is genuinely required.
3. The project's chosen state-management solution for application-wide state.
4. Server-state libraries for server/API state when the project uses one.

Do not duplicate the same source of truth across multiple stores.

---

## 11. API Communication

- Keep API calls in dedicated service/API modules rather than scattering Axios/fetch calls throughout components.
- Handle loading, success, empty, and error states.
- Do not expose secrets in frontend code.
- Never put private API keys in Vite client environment variables.

---

## 12. Environment Variables

- Never hard-code secrets.
- Use `.env` for local secrets.
- Maintain `.env.example` with variable names but no real secrets.
- Never commit `.env` files containing secrets.
- Frontend environment variables must only contain values safe to expose to the browser.

---

## 13. Security

Always consider:

- Authentication
- Authorization
- Tenant isolation
- Input validation
- Injection attacks
- CORS
- Rate limiting where appropriate
- Secure cookies
- Sensitive data exposure
- File upload validation
- Access control on every protected resource

Never assume that hiding something in the frontend provides security.

---

## 14. Error Handling

- Use centralized backend error handling.
- Return useful but safe error messages.
- Log useful server-side information for debugging.
- Never expose secrets, stack traces, database credentials, or internal implementation details to clients.

---

## 15. Code Quality

Prefer:

- Simple solutions
- Readable code
- Small functions
- Clear naming
- Reusable utilities
- Consistent structure

Avoid:

- Premature abstraction
- Over-engineering
- Duplicate logic
- Giant files
- Giant functions
- Unnecessary dependencies
- Dead code
- Commenting obvious code

Comments should explain WHY something is done when the reason is not obvious.

---

## 16. Dependencies

Before adding a dependency:

1. Check whether the functionality can reasonably be implemented with existing tools.
2. Check whether the dependency is actually needed.
3. Prefer established and maintained packages.
4. Avoid adding multiple packages that solve the same problem.

Do not install dependencies just because they might be useful later.

---

## 17. Git

Make focused commits.

Prefer commits such as:

feat: add authentication
feat: add lead pipeline
feat: add document upload
fix: prevent cross-tenant lead access
refactor: simplify lead service

Avoid huge commits containing unrelated changes.

Do not rewrite or delete existing commit history unless explicitly instructed.

---

## 18. AI Coding Rules

When using AI coding tools:

- Inspect the existing code before modifying it.
- Do not overwrite working code unnecessarily.
- Do not create files that are not needed.
- Do not change architecture without explaining why.
- Follow existing project conventions.
- Implement only the requested step.
- Do not silently add unrelated features.
- Prefer small, verifiable changes.

If requirements are ambiguous, ask before making a major architectural decision.

---

## 19. General Principle

Prefer:

Working > complicated

Simple > over-engineered

Secure > convenient

Readable > clever

Explicit > implicit

Small verified changes > large unverified changes