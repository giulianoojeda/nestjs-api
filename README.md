# NestJS Bookmark API

This project is a practice implementation of a Bookmark API using the NestJS framework. It allows users to sign-up, sign-in, and perform CRUD operations on their bookmarks. The project utilizes Prisma for database connections, Pactum for end-to-end tests, and Docker Compose for managing development and test databases.

## Features

- User authentication with sign-up and sign-in functionality
- CRUD operations for bookmarks
- Prisma for database connections
- Pactum for end-to-end testing
- Docker Compose for managing development and test databases

## Prerequisites

- Node.js v16.x or later
- Docker and Docker Compose
- A running instance of a PostgreSQL database

## Getting Started

1. Clone the repository:

```
git clone https://github.com/yourusername/nestjs-bookmark-api.git
cd nestjs-bookmark-api
```

2. Install the dependencies:

```
npm install
```

3. Set up your `.env` and `.env.test` files by copying the provided examples and updating them with your own database connection information:

```
cp .env.example .env
cp .env.test.example .env.test
```

4. Start the development database:

```
npm run db:dev:up
```

5. Deploy the Prisma schema to the development database:

```
npm run prisma:dev:deploy
```

6. Start the development server:

```
npm run start:dev
```

The API should now be running on `http://localhost:3333`.

## Available Commands

- `npm run prisma:dev:deploy`: Deploy Prisma schema to the development database
- `npm run db:dev:rm`: Remove the development database container
- `npm run db:dev:up`: Start the development database container
- `npm run db:dev:restart`: Restart the development database container and deploy Prisma schema
- `npm run prisma:test:deploy`: Deploy Prisma schema to the test database
- `npm run db:test:rm`: Remove the test database container
- `npm run db:test:up`: Start the test database container
- `npm run db:test:restart`: Restart the test database container and deploy Prisma schema
- `npm run build`: Build the project
- `npm run start`: Start the production server
- `npm run start:dev`: Start the development server with watch mode
- `npm run test:cov`: Run unit tests and generate a coverage report
- `npm run test:e2e`: Run end-to-end tests using Pactum

## API Documentation

This documentation provides an overview of the available API endpoints and their corresponding request and response structures for the NestJS Bookmark API.

### Authentication

#### Sign-up

- Endpoint: `POST /auth/signup`
- Request body:

```json
{
  "email": "example@email.com",
  "password": "your-password"
}
```

- Response status: `201 Created` on success
- Error status: `400 Bad Request` if body is empty, email is empty, or password is empty
- Error status: `403 Forbidden` if email is duplicated

#### Sign-in

- Endpoint: `POST /auth/signin`
- Request body:

```json
{
  "email": "example@email.com",
  "password": "your-password"
}
```

- Response status: `200 OK` on success
- Response body:

```json
{
  "access_token": "your-access-token"
}
```

- Error status: `400 Bad Request` if body is empty, email is empty, or password is empty

### Users

#### Get User

- Endpoint: `GET /users/me`
- Request header: `Authorization: Bearer your-access-token`
- Response status: `200 OK` on success
- Response body:

```json
{
  "id": "user-id",
  "email": "example@email.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

- Error status: `401 Unauthorized` if token is invalid

#### Edit User

- Endpoint: `PATCH /users`
- Request header: `Authorization: Bearer your-access-token`
- Request body:

```json
{
  "firstName": "John",
  "email": "example@email.com",
  "lastName": "Doe"
}
```

- Response status: `200 OK` on success
- Error status: `401 Unauthorized` if token is invalid

### Bookmarks

#### Get Bookmarks

- Endpoint: `GET /bookmarks`
- Request header: `Authorization: Bearer your-access-token`
- Response status: `200 OK` on success
- Response body: Array of bookmark objects

#### Create Bookmark

- Endpoint: `POST /bookmarks`
- Request header: `Authorization: Bearer your-access-token`
- Request body:

```json
{
  "link": "https://example.com",
  "title": "Example Website",
  "description": "A sample bookmark"
}
```

- Response status: `201 Created` on success

#### Get Bookmark by ID

- Endpoint: `GET /bookmarks/:id`
- Request header: `Authorization: Bearer your-access-token`
- Response status: `200 OK` on success
- Response body: Bookmark object

#### Update Bookmark by ID

- Endpoint: `PATCH /bookmarks/:id`
- Request header: `Authorization: Bearer your-access-token`
- Request body:

```json
{
  "title": "Updated Title"
}
```

- Response status: `200 OK` on success
- Response body: Updated bookmark object

#### Delete Bookmark by ID

- Endpoint: `DELETE /bookmarks/:id`
- Request header: `Authorization: Bearer your-access-token`
- Response status: `204 No Content` on success

## Contributing

Pull requests and suggestions are welcome. For major changes, please open an issue first to discuss what you would like to change.