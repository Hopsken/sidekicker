# Use the official Node.js image.
# Use the LTS version for better stability.
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json pnpm-lock.yaml ./

# Enable pnpm via corepack and install dependencies
RUN corepack enable pnpm && \
  pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
ENV PORT=3000
ENV FILES_DIR=/opt/data
EXPOSE 3000

# Start the application
CMD ["npm", "start"]