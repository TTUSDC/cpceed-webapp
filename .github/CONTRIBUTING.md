# Contributing
To get involved with this project, you'll need to do a few things.

## Before You Start

There are a few tools and design patterns that every front end developer for this project must familiarize themselves with:

- Redux and react-redux - Components that need to be aware of user permissions have to read it from the Redux store.
To do so, you must use the `connect` function from react-redux.
`src/components/NavBar/NavBarContainer.js` is an example of this, as is `src/components/Auth/RequireAuth.js`.
- Grommet - Grommet is the UX library used in this project.
Developers should be familiar the components it provides.
- The higher-order components design pattern - For components that can only be accessed by certain users, we have a higher order component (HOC) called `RequireAuth` that is used to check the current user's permissions.
The component calling `RequireAuth` must pass it a JavaScript object containing the permissions it requires.
An example of this is `src/routes/Activity/components/Activity.js`.
The permissions assigned to each user type are defined in `src/redux/actions.js`, so if your component requires new permissions you must add them there as well.
- react-router - This project uses react-router to manage UI with respect to the URL.
Examples of how to use it can be found in `src/appRoute.js` and `src/routes/Activity/index.js`.
- React
- ESLint
- MongoDB (back-end)
- Express.js (back-end)

The resources page on our wiki has links to information on everything listed here: https://github.com/TTUSDC/CPCEEDWebApp/wiki/Resources.

## Coding Standards
We use [Airbnb's](https://github.com/airbnb/javascript) JavaScript style guide

Notable Aspects:

- Indents should be 2 spaces.
- Regular files and folders should use `dash-separated-names`. Short folder names are preferred.
- React components should use `UpperCamelCase` for the class name, the file name, and the parent folder name.

The best way to ensure there are no stylistic problems with your code is to use ESLint:

1. Make changes to a file.
2. Save the file.
3. Run the command `node_modules/.bin/eslint [path/to/the/file]`.

## Setting Up 

1. Download the dependencies:

    - [Git](https://git-scm.com/).
    - [Node.js 8.9.3](https://nodejs.org/)
    - NPM 5.5.1
    - Yarn 1.3.2
    - MongoDB 3.4.9

2. Clone this repository by running `git clone https://github.com/TTUSDC/cpceed-webapp.git` in the location of your choice.
3. Download the dependencies by running `yarn install` when you're in the project directory.
4. Add a `.env` file to the top level of the project with the following contents:

```
MONGODB_URI=mongodb://localhost:27017/test
MONGOLAB_URI=mongodb://localhost:27017/test

SECRET=thisisoursecret
SALT=10
```

5. Visit the wiki at https://github.com/TTUSDC/CPCEEDWebApp/wiki to learn about the developer guidelines for this project.

## Testing Changes 

**Unless all of the tests pass, github will block your code from being merged**

### App

Once you've started making changes, you'll need to make sure the app still runs properly.
To use the testing server, do the following:

1. Run `npm run dev` from the project directory.
2. Enter `127.0.0.1:8080` into the URL bar of your browser to see the app.

You should also run the unit tests to ensure the code is still functioning properly.
To run the unit tests, do the following:

1. Make sure you have Firefox installed. This project has the Karma test runner set up to use Firefox.
2. Run `npm run test-app` from the project directory.

As you're writing application code, you should also be writing unit tests that can be used to ensure your code doesn't get broken.
Unit tests go in `cpceed-webapp/test`, which follows the same structure as `cpceed-webapp/src`.
You should put your tests in the `test` subdirectory that mirrors the `src` subdirectory where you wrote your application code.
For example, unit tests for files in `src/components/Auth/` go in `test/components/Auth/`.
You must make sure your tests are either included by `test/index.js` directly or included by an `index.js` file that is linked to `test/index.js` through other `include` statements.
The testing libraries used in this project are as follows:

1. Mocha: a test framework.
2. Chai: for making assertions about tests.
3. Sinon: for spying on, stubbing, or mocking functions.
4. Enzyme: a library that allows React components to be tested effectively (primarily through shallow rendering).

### API
To run the API by itself, do the following:

1. Run `npm run dev-api` from the project directory.
2. Use an API testing client such as [Postman](https://www.getpostman.com/) to hit the endpoints.

To run the unit tests, use `npm run test-api` from the project directory.

All unit tests for the API are in `cpceed-webapp/test/api`, which mirrors the structure of `cpceed-webapp/api`.

The same testing libraries are used, with the exception of Enzyme, which is not necessary.
Instead, the backend uses `supertest` to do integration tests.
For an example, see `test-auth-router.js`.
Note that any integration test that requires sign-in will need to use `agent` to persist the session cookie.
`createAndLoginUser` passes `agent` as the second argument to its callback.

