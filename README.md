# note-taking-api
Add Persistence and Categories with Type Safety

Extend the note-taking API with categories:

1.⁠ ⁠Create a Category interface and add it to the Note interface

2.⁠ ⁠Add a category field to each note with proper type validation

3.⁠ ⁠Create new endpoints with typed request and response objects:

  - GET ⁠ /api/notes/categories/:categoryId ⁠ - Get notes by category ID

  - PUT ⁠ /api/notes/:id ⁠ - Update a note

4.⁠ ⁠Add validation for the note format using a custom middleware with TypeScript generics

5.⁠ ⁠Create a typed logging middleware to track API requests

Task & Assignment WEEK 13
Add User Authentication with TypeScript

Implement basic authentication for the note-taking API:

1.⁠ ⁠Create User and Auth interfaces for type safety

2.⁠ ⁠Add a user system with registration and login using typed controllers

3.⁠ ⁠Ensure that users' passwords are hashed using bycrypt during registration.

4.⁠ ⁠Implement JWT authentication with typed payloads for protected routes

5.⁠ ⁠Associate notes with specific users using TypeScript for type relationships

6.⁠ ⁠Modify the existing endpoints to only show/modify notes belonging to the authenticated user

7.⁠ ⁠Add two new endpoints with request validation via TypeScript:

  - POST ⁠ /api/auth/register ⁠ - Register a new user

  - POST ⁠ /api/auth/login ⁠ - Login and get JWT token

8.⁠ ⁠Create a custom type guard for user authentication