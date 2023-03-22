# stage 1

FROM node:alpine AS webapp-build
WORKDIR /app
COPY package.json .
RUN npm install @angular/cli --force
RUN npm install --force
# EXPOSE 4200
# CMD ["npm", "build"]
RUN npm run build


# stage 2

FROM nginx:alpine
COPY --from=webapp-build /app/dist/webapp /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=webapp-build /app/conf/nginx-rules.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200