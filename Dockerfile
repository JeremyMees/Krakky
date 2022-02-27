#Build
FROM node:14 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

RUN  npm run build 

# Run
FROM nginx:1.16.0-alpine

COPY --from=build /app/dist/Krakky /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

ARG NGINX

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
