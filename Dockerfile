FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG SITE_URL=http://localhost
ENV SITE_URL=$SITE_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=80
ENV POSTS_DIR=/app/posts
ENV TOOLS_DIR=/app/tools
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
RUN mkdir -p /app/posts /app/tools
EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
