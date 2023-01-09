FROM node:alpine
RUN apk add --no-cache bash
WORKDIR /app
COPY ./package.json ./

# Remove cypress from server code
RUN sed -i '/cypress/c\' package.json

RUN npm install
COPY ./backend ./backend
COPY ./.env ./
COPY ./.env.test.local ./
# Remove mongo uri from env it will set on docker-compose.test.yml file
RUN sed -i '/MONGO_URI=momgodb:/c\' .env
RUN sed -i '/MONGO_URI=momgodb:/c\' .env.test.local

COPY ./compose/local/backend/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./compose/local/backend/start.sh /start.sh
RUN sed -i 's/\r$//g' /start.sh
RUN chmod +x /start.sh

ENTRYPOINT ["/entrypoint.sh"]
