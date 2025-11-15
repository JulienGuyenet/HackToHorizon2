# Use nginx alpine image for a lightweight container
FROM nginx:alpine

# Copy the public directory to nginx html directory
COPY public/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
