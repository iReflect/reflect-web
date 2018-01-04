# Development

[![CircleCI](https://circleci.com/gh/iReflect/reflect-web.svg?style=svg)](https://circleci.com/gh/iReflect/reflect-web)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1524ac994f344ceebf06f6003a1a0037)](https://www.codacy.com/app/iReflect/reflect-web?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=iReflect/reflect-web&amp;utm_campaign=Badge_Grade)

## System Setup
Install node - https://docs.npmjs.com/getting-started/installing-node  
Install npm packages - `npm install`

## Development server

- Create a file `src/environemnt/environment.ts` using `src/environemnt/environment.ts.sample` file if not present. 
You can then modify the `hostname` and `port` according to the hostname and port on which the iReflect app is running.
- Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change 
any of the source files.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
