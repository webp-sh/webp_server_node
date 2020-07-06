FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3333

ENV DOCKER=tsuki
CMD ["node","index.js"]
