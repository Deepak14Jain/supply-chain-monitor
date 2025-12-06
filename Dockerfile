# Use the official Node.js image (Version 20 is stable)
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the ports we need:
# 8545 = Blockchain (Hardhat)
# 8080 = Frontend UI
EXPOSE 8545 8080

# The command to start everything (uses the script we made earlier)
# We need to bind Hardhat to 0.0.0.0 so it can be accessed outside the container
CMD ["npm", "start"]