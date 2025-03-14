# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install 

# Copy the rest of the application files
COPY . .


# Expose the application port
EXPOSE 5000

# Generate Prisma client
RUN npx prisma generate
# RUN npx prisma db push
# Start the application
CMD ["yarn", "docker"]
