# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and lockfile
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy app
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
