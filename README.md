# HackerNews Server

A backend implementation of a Hacker News-like platform with user authentication, posts, likes, and comments.

## Overview

This project replicates the core features of the Hacker News platform as a RESTful API server built with Hono.js. It includes user authentication, post management, like functionality, and commenting capabilities.

## Tech Stack

- Node.js
- Hono.js (lightweight, high-performance web framework)
- Prisma (ORM)
- TypeScript
- JWT for authentication
- PostgreSQL database

## Features

- **User Authentication**: JWT-based sign-up and login
- **User Management**: View profile and list users
- **Posts**: Create, read, and delete posts
- **Likes**: Like and unlike posts with protection against duplicate likes
- **Comments**: Add, view, edit, and delete comments
- **Pagination**: All list endpoints support pagination

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/authentication/sign-up` | Signs up a user (leverages JWT) |
| `POST` | `/authentication/log-in` | Logs in a user (leverages JWT) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/me` | Returns the current user's details (based on JWT token) |
| `GET` | `/users` | Returns all users |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts` | Returns all posts in reverse chronological order (paginated) |
| `GET` | `/posts/me` | Returns all posts of the current user in reverse chronological order (paginated) |
| `POST` | `/posts` | Creates a post (authored by the current user) |
| `DELETE` | `/posts/:postId` | Deletes a post if it belongs to the current user |

### Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/likes/on/:postId` | Returns all likes on a post in reverse chronological order (paginated) |
| `POST` | `/likes/on/:postId` | Creates a like by the current user on a post (only one like per user per post) |
| `DELETE` | `/likes/on/:postId` | Deletes the current user's like on a post if it exists |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/on/:postId` | Returns all comments on a post in reverse chronological order (paginated) |
| `POST` | `/comments/on/:postId` | Creates a comment by the current user on a post |
| `DELETE` | `/comments/:commentId` | Deletes a comment if it belongs to the current user |
| `PATCH` | `/comments/:commentId` | Updates a comment's text if it belongs to the current user |

## Project Structure

```
hackernews-server/
├── src/
│   ├── controllers/            # Business logic handlers
│   │   ├── authentication/     # Authentication functionality
│   │   ├── comments/           # Comment operations
│   │   ├── likes/              # Like operations
│   │   ├── posts/              # Post operations
│   │   └── users/              # User operations
│   ├── routes/                 # API routes definition
│   │   └── middlewares.ts/     # Middleware functions
│   ├── extras/                 # Extra utilities
│   │   └── prisma.ts           # Prisma client configuration
│   ├── environment.ts          # Environment variables
│   ├── index.ts                # Entry point
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hackernews-server.git
   cd hackernews-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   npx prisma migrate dev
   ```

4. Create a `.env` file with the following variables:
   ```
   PORT=5002
   DATABASE_URL="postgresql://user:password@localhost:5432/hackernews"
   JWT_SECRET="your_secure_jwt_secret"
   ```

5. Start the server:
   ```
   npm run dev
   ```

## API Usage

### Authentication

To access protected endpoints, include the JWT token in the request header:

```
token: <your_jwt_token>
```

### Pagination

For endpoints that support pagination, use query parameters:

```
?page=1&pageSize=10
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200/201`: Success
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `409`: Conflict (e.g., duplicate username)
- `500`: Internal server error

## Security Features

- Password hashing using SHA-256
- JWT token-based authentication
- Authorization checks for protected operations