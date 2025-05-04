# Step 1: Base build image
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all files needed for building
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install only prod dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev

COPY --from=base /app /app

# Set environment variables if needed
ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "start"]
