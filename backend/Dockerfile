
FROM node:23-bullseye

WORKDIR /app
COPY package.json .
RUN npm install .

CMD ["npm", "run", "dev"]