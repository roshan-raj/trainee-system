FROM node:7
WORKDIR /dockapp
COPY package.json /dockapp
RUN npm install
COPY . /dockapp
CMD node server.js
EXPOSE 8080