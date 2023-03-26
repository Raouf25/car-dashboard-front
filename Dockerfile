# Stage 1: Builder
FROM node:alpine AS builder

# Set the working directory
WORKDIR /car-dashboard-front

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies using package-lock.json
RUN npm ci 

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy the nginx configuration file to the container
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application to the container
COPY --from=builder /car-dashboard-front/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Set the default command for the container to start nginx and run it in the foreground
CMD ["nginx", "-g", "daemon off;"]
