# Restful Booker API Automation

Professional API test automation project for the public [Restful Booker API](https://restful-booker.herokuapp.com). The suite validates booking workflows through automated HTTP tests, covering happy paths, headers, authorization, payload validation, business rules, security-oriented scenarios, and known API behavior inconsistencies.

## Project Overview

This project was built to exercise the main REST operations available in the Restful Booker service:

- Create bookings with `POST /booking`
- Retrieve bookings with `GET /booking` and `GET /booking/{id}`
- Fully update bookings with `PUT /booking/{id}`
- Partially update bookings with `PATCH /booking/{id}`
- Delete bookings with `DELETE /booking/{id}`
- Generate authentication tokens with `POST /auth`

The tests are written in JavaScript and use reusable helpers, fixtures, and factories to keep the scenarios readable, maintainable, and easy to extend.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Mocha**: Test runner
- **Chai**: Assertion library
- **Supertest**: HTTP request library for API testing
- **Mochawesome**: HTML test report generator
- **Faker**: Dynamic test data generation
- **date-fns**: Dynamic date handling
- **dotenv**: Environment variable management

## Project Structure

```text
.
├── factories/
│   └── bookingFactory.js
├── fixtures/
│   ├── booking.json
│   └── credentials.json
├── helpers/
│   ├── addBooking.js
│   ├── authentication.js
│   ├── datesHelper.js
│   └── getBooking.js
├── test/
│   └── booking/
│       ├── delete-booking.test.js
│       ├── get-booking.test.js
│       ├── patch-booking.test.js
│       ├── post-booking.test.js
│       └── put-booking.test.js
├── package.json
├── package-lock.json
└── README.md
```

## Test Coverage

The current automated suite covers the main booking lifecycle:

| Endpoint | Coverage |
| --- | --- |
| `POST /booking` | Booking creation, response body validation, headers, invalid data, business rules, special characters, and security payloads |
| `GET /booking` | Booking list retrieval, booking retrieval by ID, response structure, data types, headers, and invalid IDs |
| `PUT /booking/{id}` | Full booking update, authentication, headers, invalid data, business rules, invalid IDs, special characters, security payloads, and idempotency |
| `PATCH /booking/{id}` | Partial field updates, authentication, headers, invalid data, business rules, invalid IDs, special characters, security payloads, and idempotency |
| `DELETE /booking/{id}` | Successful deletion, authentication failures, invalid IDs, and repeated delete behavior |
| `POST /auth` | Token generation through the authentication helper |

Some tests intentionally document defects or unexpected behavior from the public API, such as accepting invalid dates, accepting script-like strings, or returning status codes that differ from typical REST conventions.

## How to Install

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
BASE_URL=https://restful-booker.herokuapp.com
```

Authentication credentials are stored in:

```text
fixtures/credentials.json
```

## How to Run Tests

Run the complete test suite:

```bash
npm test
```

The test command executes all files that match:

```text
./test/**/*.test.js
```

Mochawesome is configured as the reporter. After execution, the HTML report is generated in:

```text
mochawesome-report/
```

## Folder Structure

### `test/`

Contains the automated test specifications organized by API resource. The current suite is focused on the `booking` resource and separates each HTTP operation into its own file.

### `helpers/`

Contains reusable functions that support test setup and API interactions.

### `factories/`

Contains dynamic payload builders used to generate valid and customizable test data.

### `fixtures/`

Contains static test data, such as authentication credentials and sample booking payloads.

## Helpers Explanation

### `helpers/authentication.js`

Generates an authentication token by calling `POST /auth` with the credentials from `fixtures/credentials.json`. The token is used by protected operations such as `PUT`, `PATCH`, and `DELETE`.

### `helpers/addBooking.js`

Creates a new booking before tests that need an existing booking ID. It returns both the generated `bookingId` and the original `bookingBody`, allowing tests to validate persisted data.

### `helpers/getBooking.js`

Retrieves a booking by ID using `GET /booking/{id}`. This helper is useful for validating whether updates or deletions were actually persisted by the API.

### `helpers/datesHelper.js`

Provides date utilities based on `date-fns`, including functions to add or subtract days from the current date and return values in `yyyy-MM-dd` format.

## Factories Explanation

### `factories/bookingFactory.js`

The booking factory creates dynamic booking payloads using Faker. It generates realistic values for:

- `firstname`
- `lastname`
- `totalprice`
- `depositpaid`
- `bookingdates.checkin`
- `bookingdates.checkout`
- `additionalneeds`

The factory also supports overrides, making it easy to customize only the fields required by a specific test:

```javascript
const booking = createBooking({
  firstname: 'Maria',
  bookingdates: {
    checkin: '2026-10-09'
  }
});
```

## Test Categories

The test files are organized with descriptive `describe` blocks that group scenarios by purpose:

- **Happy Path**: Valid flows for creating, retrieving, updating, and deleting bookings
- **Authorization**: Missing or invalid token scenarios for protected endpoints
- **Headers Validation**: `Accept` header behavior and response `Content-Type`
- **Response Structure**: Expected response fields and nested properties
- **Response Data Validation**: Data type and date format assertions
- **Invalid Data Types**: Null values, invalid booleans, and malformed dates
- **Business Rules**: Domain expectations such as checkout date after checkin date
- **Invalid Booking ID**: Nonexistent, invalid, or zero booking IDs
- **Special Characters**: Unicode and symbol handling in request fields
- **Security Tests**: Script and SQL injection style payloads
- **Idempotency**: Repeated update or delete operations and persisted state validation

## Improvements for the Future

- Add a CI pipeline with GitHub Actions to run the suite automatically on pull requests.
- Add environment-specific configuration for local, staging, and production-like targets.
- Add schema validation for response bodies.
- Add test tags or npm scripts to run smoke, regression, security, and negative suites separately.
- Add retry or health-check logic for the public API, since availability and behavior may vary.
- Add linting and formatting tools such as ESLint and Prettier.
- Add coverage badges and CI status badges to the README.
- Add Allure or enhanced Mochawesome report publishing.
- Add contract testing for stricter validation of API expectations.
- Add cleanup helpers where possible to reduce test data left in the public service.

## Notes

This project tests a public demo API. Because the service is externally hosted, test results may vary if the API is unavailable, slow, or changes behavior.

Several tests intentionally describe expected behavior that the current API may not follow. These tests are valuable because they document potential bugs, validation gaps, and security concerns discovered during automation.
