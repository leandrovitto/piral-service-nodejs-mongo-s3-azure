FROM node:18.14.2-alpine

# Create directory that runs the app on docker
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package.json package-lock.json ./
COPY package*.json ./

# COPY
COPY prisma ./prisma/

# COPY ENV variable
#COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# Install package.json dependencies
RUN npm install

# COPY
COPY . .

RUN npm run build
# Generate prisma client
RUN npx prisma generate

# Run and expose the server on port 9999
EXPOSE 9999

# A command to start the server
CMD npm run start:docker