# Use an official Node.js runtime as the base image
FROM node:16.20.1

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY . .

# Install npm dependencies
RUN npm install
RUN npm i --save redis@3.0.2
RUN npm audit fix --force
# RUN npm install -g npm@10.5.0

# Copy the rest of the application code to /app
COPY . .

# Make the container's port 8000 available to the outside world
EXPOSE 8000

# Run the Node.js application
CMD ["node", "src/index.js"]
