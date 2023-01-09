FROM cypress/included:9.6.1

WORKDIR /app
COPY ./package.json ./ 
COPY ./cypress ./cypress
COPY ./cypress.json ./
RUN npm install
COPY ./backend ./backend
COPY ./.env ./
COPY ./.env.test.local ./
# Remove mongo uri from env it will set on docker-compose.test.yml file
RUN sed -i '/MONGO_URI=momgodb:/c\' .env
RUN sed -i '/MONGO_URI=momgodb:/c\' .env.test.local

COPY ./compose/test/e2e/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Replace baseUrl and apiUrl for running in docker
RUN sed -i '/baseUrl/c\ "baseUrl": "http://nginx:80",' cypress.json
RUN sed -i '/apiUrl/c\ "apiUrl": "http://backend:5000",' cypress.json

ENTRYPOINT ["/entrypoint.sh"]
CMD ["cypress"]
