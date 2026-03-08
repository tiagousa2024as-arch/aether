# Database

- **Schema**: Prisma schema lives in `/prisma/schema.prisma`.
- **Client**: Use `db` from `@/server/db` in server code (tRPC, API routes, server components).
- **Migrations**: `npm run db:migrate` (dev), `prisma migrate deploy` (production).
- **Seeds**: Add `prisma/seed.ts` and `"prisma": { "seed": "ts-node prisma/seed.ts" }` in package.json if needed.
