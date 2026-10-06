To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

This starts both the API and its background workers for local development.
Make sure Redis is available at `REDIS_URL`.

The OTP worker currently prints a development OTP to the console. Configure an
SMS provider before using OTP delivery in production; the worker fails those
jobs until a provider is implemented.

In production, run the whole application, including the API and background
workers, with:
```sh
bun run start
```

Open http://localhost:3000
