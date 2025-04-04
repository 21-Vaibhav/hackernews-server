# Use the official Node.js image as base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies
COPY package.json package-lock.json ./
RUN npm install

# Ensure TypeScript is installed
RUN npx tsc --version

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npx tsc

# Use a lightweight runtime image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
