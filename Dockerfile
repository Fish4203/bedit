# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY bin bin
COPY controllers controllers
COPY middleware middleware
COPY models models
COPY public public
COPY routes routes
COPY views views
COPY app.js app.js
COPY process.yml process.yml
COPY start.sh start.sh
COPY package-lock.json package-lock.json
COPY package.json package.json

# Installing dependencies
RUN npm install

# Installing pm2 globally
RUN npm install pm2 -g

# Exposing server port
EXPOSE 3000


# Starting our application
CMD ./start.sh && tail -f /dev/null
