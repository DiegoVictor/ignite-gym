# Ignite Gym
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/ignite-gym/config.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/ignite-gym/actions)
![prisma](https://img.shields.io/static/v1?label=prisma&message=4.13.0&color=2d3748&logo=prisma&style=flat-square)
[![eslint](https://img.shields.io/badge/eslint-8.38.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![vitest](https://img.shields.io/badge/jest-0.30.1-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/ignite-gym/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Gym&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fignite-gym%2Fmain%2FInsomnia_2023-05-19.json)

Allow users to register themselves as admin or members, allow admin users to create gyms and validate check-ins. Allow members to check-in, get their profile, search/fetch gyms. and much more! The app has pagination and use JWT to authentication.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Postgres](#postgres)
      * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Bearer Token](#bearer-token)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)

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

### Postgres
Responsible to store all application data. If for any reason you would like to create a Postgres container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name ignite-gym-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

#### Migrations
Remember to run the database migrations:
```
$ yarn ts-node-dev ./node_modules/typeorm/cli.js migration:run
```
Or:
```
$ yarn typeorm migration:run
```
> See more information on [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### .env
In this file you may configure your JWT settings, the environment, app's port and database connection Url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment.|`dev`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|DATABASE_URL| Database connection Url.|`postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

