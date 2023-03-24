# stage 1

FROM node:latest AS webapp
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build


# stage 2

FROM nginx:alpine
COPY --from=webapp /app/dist/webapp /usr/share/nginx/html

EXPOSE 80