# Use an official Node.js Alpine image for a smaller footprint
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 as used by server.js
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
