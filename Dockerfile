# Use the official Node.js image as the base image
FROM node:20 AS builder

# Set the working directory to /workspace
WORKDIR /workspace

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a smaller image for the production environment
FROM node:20 AS production

# Set the working directory to /workspace
WORKDIR /workspace

# Copy necessary files from the builder stage
COPY --from=builder /workspace/build ./build
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/package.json ./package.json
COPY --from=builder /workspace/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
