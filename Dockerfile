# Build stage
FROM node:18.20.3-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18.20.3-alpine AS production

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Install only production dependencies with legacy peer deps flag
RUN npm ci --only=production --legacy-peer-deps

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port the app will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]