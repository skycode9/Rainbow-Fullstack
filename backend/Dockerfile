# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
