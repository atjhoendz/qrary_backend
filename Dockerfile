FROM node:12-alpine
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app
EXPOSE 8080
RUN npm install -g nodemon
CMD ["nodemon", "/app/src/app.js"]
