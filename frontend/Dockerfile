# Stage 1: Build Stage 
FROM node:22-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --immutable
COPY frontend/ .
RUN yarn build 

# Stage 2: Production Stage 
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
