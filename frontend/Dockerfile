# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application
# RUN yarn build

# Expose the frontend port
EXPOSE 5173

# Start the application
CMD ["yarn", "dev"]
