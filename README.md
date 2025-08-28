## Setup

Make sure to install dependencies:

```bash
pnpm i
pnpm dlx prisma migrate dev
pnpm dlx prisma db seed
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

## Prisma

Sync local database with schema

```bash
pnpm dlx prisma migrate dev
```

Generate types

```bash
pnpm dlx prisma generate
```

Deploy migration changes for production:

```bash
pnpm dlx prisma migrate deploy
```

Seed development database:

```bash
pnpm dlx prisma db seed
```
