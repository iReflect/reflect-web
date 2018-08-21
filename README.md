# iReflect Client-Side Application

[![CircleCI](https://circleci.com/gh/iReflect/reflect-web.svg?style=svg)](https://circleci.com/gh/iReflect/reflect-web)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1524ac994f344ceebf06f6003a1a0037)](https://www.codacy.com/app/iReflect/reflect-web?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=iReflect/reflect-web&amp;utm_campaign=Badge_Grade)

## Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

``` git clone git@github.com:iReflect/reflect-web.git
cd reflect-web
```

## Installation

### Platform & tools

You need to install Node and then the development tools. Node comes with a package manager called npm for installing Node applications and libraries.

- Install node - `https://docs.npmjs.com/getting-started/installing-node`

### Warning

> Verify that you are running at least node 8.9.x and npm 5.x.x by running node -v and npm -v in a terminal window. Older versions might produce errors, but newer versions are fine.

- Install local dependencies (from the project root folder):

> This will install the dependencies declared in the package.json file

``` cd reflect-web
npm install
```

## Development

### Setup the server

- Create a file `src/environment/environment.ts` using `src/environment/environment.ts.sample` file if not present.You can then modify the configurations accordingly.

- Create a file `assets/config/config.local.json` using `assets/config/config.json.sample` file in your local machine and put the environment specific information in this file.

> **Note:** Make sure that this config file is present in the final build of the application (in the same `assets/config` folder, named according to the environment) for the application to work properly.

#### Start the server

- Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build the web-app

This app is made up of a number of Typescript, SCSS and HTML files that need to be merged into a final distribution for running.  We can use the angular-cli tool to do this (or the npm script which is nothing but a wrapper for the angular-cli command).

*Build client application (for development server):
    ```cd reflect-web
    npm run build```

*Build client application (for production server):
    ```cd reflect-web
    npm run prod-build```

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

For more information, see [ng test](https://github.com/angular/angular-cli/wiki/test) command.

## Running end-to-end tests

Run `npm e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

For more information, see [ng e2e](https://github.com/angular/angular-cli/wiki/e2e) command.

## Contributing

- Fork the repo under your Github account.
- Get the package:

```git clone git@github.com:GITHUB_USERNAME/reflect-web.git
```

- Set your fork as a remote:

```git remote add fork git@github.com:GITHUB_USERNAME/reflect-web.git
    ```
- File a ticket in our issue tracker [iReflect-Kanban](https://ireflect.atlassian.net/).
- Make changes, commit to your fork.
- Send a pull request with your changes.
