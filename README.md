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
- Docker / Docker Compose — containerized runtime for the API and DB

# Getting started

1. Copy the environment example file:

```
cp .env.example .env
```

2. Build and start services with Docker Compose:

```
docker compose up --build
```

3. Open a shell inside the running API container:

```
docker compose exec api sh
```

4. Inside the container, run database migrations and seed data:

```
npm run migrate
npm run seed
```

5. Exit the container shell:

```
exit
```

6. The API should now be reachable (by default) at http://localhost:3000/api. You can import the Postman collection in the /postman folder to explore the API or run the automated Postman tests:

```
APIURL=http://localhost:3000/api ./postman/run-api-tests.sh
```

# Postman

- Postman collection: /postman
- Run tests script: /postman/run-api-tests.sh (see command above)

# Notes

- Ensure Docker is installed and running before using Docker Compose.
