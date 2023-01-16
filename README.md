# Delivery fee calculator

This is a delivery fee price calculator written in TypeScript and built on React.
Money and currency handling are done through [Dinero.js library](https://github.com/dinerojs/dinero.js/) to bypass floating number rounding issues.


## Installation

To start, install needed dependencies with npm:

```
npm install
```

## Building and deployment

To build and deploy the app, run the following commands.
There's no need to install serve if you already have it.

```
npm install -g serve
npm run build
serve -s build
```

## Development

To run the server use:

```
npm start
```

These scripts can be used during development

- `npm run lint` runs the linter
- `npm run lint:fix` runs the linter and automatically fixes what it can
- `npm run format` formats all files

## Testing

To run all tests use:

```
npm test
```

- Use `npm run test:coverage` to see the coverage report
