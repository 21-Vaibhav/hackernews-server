# Use the official Node.js image as base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (including dev dependencies)
COPY package.json package-lock.json ./
RUN npm install

# Ensure TypeScript is installed
RUN npm list typescript || npm install -D typescript

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a lightweight runtime image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Install `tsx` globally in the production container
RUN npm install -g tsx

# Expose the port
EXPOSE 3000

# Start the application using tsx
CMD ["tsx", "dist/index.js"]
