# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose port
EXPOSE 5000

# Environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Startup command: push database schema to PostgreSQL database, then run the compiled JS server
CMD ["sh", "-c", "npx prisma db push && npm start"]
