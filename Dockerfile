FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run dev; fi"]