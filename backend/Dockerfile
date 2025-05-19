
FROM node:23-bullseye

WORKDIR /app
COPY package.json .
COPY . .
RUN npm install .

CMD ["npm", "run", "dev"]