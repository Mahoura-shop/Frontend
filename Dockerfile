# Use official Node.js image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm i

# Copy the rest of the project files
COPY . .

COPY .env.local .env.local

# Build the Next.js application
RUN npm run build

# Start the Next.js app
CMD ["npm", "run", "start"]
