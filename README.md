# Node.js Clean Architecture RESTful API in TypeScript

version: 'v2.5.1'

## Description

This is my demo of a RESTful API implementing Robert Martin's clean architecture in TypeScript. I do not use any third party packages for inversion of control, like InversifyJS. I use dependency injection in order to maintain a one-way flow of dependency. I also use interfaces to satisfy Bob Martin's requirement of "use case output/input ports", which are then implemented by their use cases.

- Web Delivery Mechanism
  - Express.js
- Database Repositories
  - PG
- External Services
  - jsonplaceholder (example)

## Uncle Bob's Clean Architecture Diagram

I tried to organize the application's files and folders according to this diagram:

[![Clean Architecture - By Uncle Bob](https://bl3302files.storage.live.com/y4mW9gccE03kr2tBTyqM-5NVT6uzZK0XZJpZff4jeKZIAJXRTN72oziMhtO1B8wv1NO0nQvCv9oGe5PRlH1OdRVSxGIBF0n5txGYQVP-eQs1wpFDb8WJICZ981zO2XC3Ho5_38QQOoDtn0qMUIy_3jEWyQ8iyS9JkNPJd2VuuzWFwwBFw7BC8zUNy2q7mRJRSDa?width=668&height=491)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

# Routes

look postman documentation

## Run Locally

#### Prerequisites

- Node.js
- TypeScript
- PostgreSQL

#### 1. Clone the repo and install dependencies

```bash
git clone
cd Skill Test PT.Knitto
npm install
```

#### 2. Modify the .env file

In the `.env` file, update the following environment variables for sequelize to work correctly.

- DB_DIALECT
  - (Enter "postgresRaw" to use the pg raw as database client)
- DB_NAME
- DB_USERNAME
- DB_PASSWORD
- DB_HOST
- DB_PORT
- PORT
- JWT_SECRET
  - (Defaults to 3000)

#### 3. Import Dump SQL and Postman

import backup-db-postgresql.sql first if it doesn't work import dump.sql

import Skill Test PT.Knitto.postman_collection.json file

#### 4. Start the server

To run in production mode where code is transpiled into a `dist` folder and run directly in `node`:

```bash
npm start
```

To run in development mode where code is run by ts-node-dev and re-transpiled any time there is a change:

```bash
npm run dev:watch
```
