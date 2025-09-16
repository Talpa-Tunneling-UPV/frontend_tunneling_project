# Use of multi-stage build to get a lighter final image

# Build stage -> compile project
FROM node:20 AS build
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching.
# npm install will only re-run if these files change.
COPY ./app/package*.json ./
RUN npm install

# Copy the rest of the code
COPY ./app/ .
RUN npm run build

# Production stage -> deploy project
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx when the container launches.
CMD ["nginx", "-g", "daemon off;"]
