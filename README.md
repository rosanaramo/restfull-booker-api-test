# Automation Documentation

## Project Overview
This project contains an API automation test suite for the login endpoint using JavaScript, Mocha, Chai, and Supertest.

## Objectives
- Validate the login API behavior with valid credentials.
- Verify HTTP status codes and response structure.
- Provide a simple and maintainable automated test structure.

## Technologies Used
- Node.js
- Mocha: test runner
- Chai: assertion library
- Supertest: HTTP assertions for API testing

## Project Structure
- package.json: project configuration and test script
- test/login.test.js: login API automation test

## Test Execution
Run the tests with:

```bash
npm test
```

## Current Automated Scenario
### Login API
- Method: POST
- Endpoint: /auth
- Base URL: https://restful-booker.herokuapp.com
- Payload:
  - username: admin
  - password: password123

### Expected Result
- Status code: 200
- Response contains a token field as a string

## Example Test Flow
1. Send a POST request to the login endpoint.
2. Set the content type to application/json.
3. Send the credentials in the request body.
4. Assert that the response status is 200.
5. Assert that the response contains a token string.

## Notes
- The test currently uses a public demo API.
- The suite can be expanded with additional scenarios such as invalid credentials, empty fields, and error handling.
