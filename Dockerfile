# Image source (alpine for dev)
FROM node:16.20.0-alpine

# Create folder public and logs
RUN mkdir -p /vol/public /vol/logs 

# Change permission folder
RUN chmod -R 777 /vol/public /vol/logs

# Working directory
WORKDIR /vol/app

# Copy all .json file
COPY package*.json .

# Install dependency
RUN npm install

# Copy all file
COPY . .

# Execute command
CMD ["npm", "run", "start:dev"]