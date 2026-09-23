# syntax=docker/dockerfile:1

FROM node:22.21.1-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
WORKDIR /app
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# Migrations run through drizzle-kit, which is a devDependency and resolves the
# "#" import map against src/ rather than dist/. This stage therefore keeps the
# full dependency tree and the TypeScript sources; it is deployed as a Job, not
# as a long-running service.
FROM build AS migrator
WORKDIR /app
COPY drizzle.config.ts ./
USER node
CMD ["npm", "run", "migrate"]

FROM deps AS prune
WORKDIR /app
RUN npm prune --omit=dev

FROM node:22.21.1-alpine AS runtime
# Patched base packages, and no package manager: the runtime only executes the
# built application, so npm and its bundled dependencies are removed.
RUN apk upgrade --no-cache \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app

ENV NODE_ENV=production

COPY --from=prune /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY public ./public

USER node

EXPOSE 3000

# The application exposes no dedicated health route, so the probe uses the
# cheapest real endpoint: it returns 200 only when the database is reachable.
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/tags').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/src/server.js"]
