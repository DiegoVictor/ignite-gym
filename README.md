# Ignite Gym
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/ignite-gym/config.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/ignite-gym/actions)
[![postgres](https://img.shields.io/badge/postgres-326690?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![prisma](https://img.shields.io/static/v1?label=prisma&message=5.13.0&color=2d3748&logo=prisma&style=flat-square)](https://www.prisma.io)
[![typescript](https://img.shields.io/badge/typescript-5.4.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![vitest](https://img.shields.io/badge/vitest-1.52.2-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/ignite-gym?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/ignite-gym)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/ignite-gym/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Gym&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fignite-gym%2Fmain%2FInsomnia_2025-03-01.json)

Allow users to register themselves as admin or members, allow admin users to create gyms and validate check-ins. Allow members to check-in, get their profile, search/fetch gyms. and much more! The app has pagination and use JWT to authentication.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [Postgres](#postgres)
      * [Migrations](#migrations)
* [Usage](#usage)
  * [Bearer Token](#bearer-token)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application uses just one database: [Postgres](https://www.postgresql.org/).

### .env
In this file you may configure your JWT settings, the environment, app's port and database connection Url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment.|`dev`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|DATABASE_URL| Database connection Url.|`postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public`

### Postgres
Responsible to store all application data. If for any reason you would like to create a Postgres container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name ignite-gym-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

#### Migrations
Remember to run the database migrations:
```
$ npx prisma migrate dev
```
> See more information on [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate).

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
POST http://localhost:3333/gyms Authorization: Bearer <token>
```
> Get your token after authenticate through the `/sessions` route, it returns a `token` key with a Bearer Token.

## Routes
|route|HTTP Method|params|description|auth method
|:---|:---:|:---:|:---:|:---:
|`/users`|POST|Body with user `name`, `email` and `password`.|Create new user.|:x:
|`/sessions`|POST|Body with user `email` and `password`.|Authenticates user and return a Bearer Token.|:x:
|`/token/refresh`|PATCH|Cookie with the `refreshToken` generate in the sign in (`/sessions`).|Generate a new Bearer Token.|Cookie
|`/me`|GET| - |Get the logged in user profile.|Bearer
|`/gyms`|POST|Body with gym `name`, `description`, `phone`, `latitude` and `longitude`.|Create a new gym. Only `ADMIN` users are allowed.|Bearer
|`/gyms/nearby`|GET|Query parameters with user current `latitude` and `longitude`.|Look for gyms nearby of the user.|Bearer
|`/gyms/search`|GET|Query parameters with `q` (query to use in the search) and optionally `page`.|Search for gyms based in the query provided.|Bearer
|`/gyms/:gymId/check-ins`|POST|Body with user current `latitude` and `longitude`.|Check in user on a gym.|Bearer
|`/check-ins/history`|GET| - |Return user's check-ins.|Bearer
|`/check-ins/:checkInId/validate`|PATCH| - |Validate an user check-in. Only `ADMIN` users are allowed.|Bearer
|`/check-ins/metrics`|GET| - |Return user's check-ins count.|Bearer

> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests
* `POST /users`

Request body:
```json
{
	"name": "John Doe",
	"email": "johndoe@example.com",
	"password": "123456"
}
```

* `POST /sessions`

Request body:
```json
{
	"email": "johndoe@example.com",
	"password": "123456"
}
```

* `POST /gyms`

Request body:
```json
{
	"name": "Ignite Gym",
	"description": "Gym for Ignite Students",
	"phone": "8772810274",
	"latitude": "79.1721",
	"longitude": "43.0377"
}
```

* `POST /gyms/:gymId/check-ins`

Request body:
```json
{
	"latitude": "79.1721",
	"longitude": "43.0377"
}
```

# Running the tests
[Vitest](https://vitest.dev/) was the choice to test the app, to run the unit tests:
```
$ yarn test:unit
```
Or:
```
$ npm run test:unit
```
And to run the E2E tests:
```
$ yarn test:e2e
```
Or:
```
$ npm run test:e2e
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
