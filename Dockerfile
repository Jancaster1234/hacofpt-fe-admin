# Build stage
FROM --platform=linux/amd64 node:18.20.3 AS build

WORKDIR /app

# Install OS dependencies to build native modules if needed
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:18.20.3-slim AS production

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose app port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
