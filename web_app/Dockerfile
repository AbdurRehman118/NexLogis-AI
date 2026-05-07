# Step 1: Build the React app
FROM node:20-slim AS build

WORKDIR /app

# Add build-time arguments for environment variables (Vite bakes these in)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files from web_app directory
COPY web_app/package*.json ./
RUN npm install

# Copy the rest of the web_app source
COPY web_app/ ./
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
