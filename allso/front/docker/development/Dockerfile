# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:18-slim

ENV DEBIAN_FRONTEND=noninteractive

# Set a working directory inside the container
WORKDIR /app

# Install the Vue CLI globally inside the container
RUN npm install -g @vue/cli

# Create a new Vue.js project using the Vue CLI
# RUN vue create .

# Expose the default Vue.js development server port
EXPOSE 8080

# Start the development server
CMD ["npm", "run", "serve"]
