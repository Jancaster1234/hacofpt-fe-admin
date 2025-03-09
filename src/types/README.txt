/src
  /types                # Centralized types folder
    /entities           # For main domain entities (Hackathon, User, Team, etc.)
      hackathon.ts
      user.ts
      team.ts
    /api                # For API response/request types
      hackathonApi.ts
      userApi.ts
    /common         # For shared utility types (e.g., Pagination, Status enums)

Best Practice: Keep types/ in Next.js and models/ in Spring Boot
Next.js frontend → Define types (src/types/) for API response validation.
Spring Boot backend → Define models for database handling and API response.

filename convention in types folder: camelCase