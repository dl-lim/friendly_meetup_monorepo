FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.js index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY api/server.js ./api/server.js
ENV PORT=8080
EXPOSE 8080
CMD ["node", "api/server.js"]
