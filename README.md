# ![RealWorld Example App](logo.png)

> ### RealWorld Express + TypeScript codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://demo.realworld.build/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase demonstrates a fully fledged backend implementation of the RealWorld spec using Express and TypeScript. It implements CRUD operations, authentication, routing, pagination, and follows common best practices for a production-style API.

For the RealWorld API spec and example clients, see the official docs: https://docs.realworld.show/

# How it works

This repository implements the RealWorld API as an Express-based HTTP server written in TypeScript. Postgres is used as the primary database and Drizzle is used as the TypeScript-friendly query/ORM layer. The app is containerized with Docker so the API and database can be run together in development.

Key components:

- Express — HTTP server and routing
- TypeScript — static typing and improved DX
- Postgres — relational persistence
- Drizzle — typesafe queries and migrations
- Docker — containerized runtime for the API

# Getting started

The full local stack (API, frontend and Postgres) is defined in the
infrastructure repository at `../infrastructure/docker/`.

1. Copy the environment example file:

```
cp ../infrastructure/docker/.env.example ../infrastructure/docker/.env
```

2. Build and start the services:

```
cd ../infrastructure/docker
docker compose up --build
```

Database migrations are applied by the `migrate` service before the API starts.

3. Seed sample data (optional):

```
docker compose run --rm migrate npm run seed
```

4. The API should now be reachable (by default) at http://localhost:8080/api. You can import the Postman collection in the /postman folder to explore the API or run the automated Postman tests:

```
APIURL=http://localhost:8080/api ./postman/run-api-tests.sh
```

# Postman

- Postman collection: /postman
- Run tests script: /postman/run-api-tests.sh (see command above)

# Notes

- Ensure Docker is installed and running before using Docker Compose.
