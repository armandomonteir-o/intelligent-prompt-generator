# Stage 1: Build Stage 
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable
COPY . .
RUN yarn build 

# Stage 2: Production Stage 
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --immutable
COPY --from=builder /app/dist ./dist
EXPOSE 3005
CMD ["node", "dist/index.js"]