# Professionals Scheduling API

![Node](https://img.shields.io/badge/node-13.12-green.svg)
![Mongo](https://img.shields.io/badge/mongodb-4.0-green.svg)

### Guide

1. [Installing necessary dependencies](#installing-necessary-dependencies)
2. [Running the app](#running-the-app)
3. [Documentation](#documentation)
4. [Tests](#tests)
5. [Decisions](#decisions)

## Installing Necessary Dependencies

First of all, you need to install Docker and docker-compose in case you don't have them already installed. For this, you can access this [link](https://docs.docker.com/install/) and install Docker and [here](https://docs.docker.com/compose/install/) for docker-compose.

## Running the App

Now we can run the app. Go to project root path, where is located `Makefile` and run `make run-app` to bring services up. Docker may need to build images for the first time, and this operation may take some time to complete. Example:

### Running Makefile

```bash
$ make run-app
Running the application
Creating mongodb ... done
Creating api     ... done
...
...
...
mongodb | 2020-07-12T23:41:53.056+0000 I  NETWORK  [conn1] end connection 127.0.0.1:40020 (0 connections now open)
api    | yarn run v1.22.4
api    | $ node src/index.js
api    | Server is running on port 3000
```

### The following addresses can be used to access running services:

-   [http://localhost:3000/api/v1](http://localhost:3000/api/v1), for the API.
-   [http://localhost:3000/api-docs](http://localhost:3000/api-docs), for swagger.

## Tests

For run the tests just go to project root path and run `make tests`. You can access the coverage opening in your browser the `index.html` file generated inside,`src/__tests__/lcov-report/` at the root of the project, we managed to keep the coverage above 97. The test setup already configurarted in .env.test file.

## Documentation

-   For API documentation and usage, was used the Swagger.io, after run the app you can access the Swagger [here](http://localhost:3000/api-docs) to see how to use the application routes.
