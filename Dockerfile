FROM node:12-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 8080
RUN npm install -g nodemon
CMD ["nodemon", "/app/src/app.js"]
