# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:20.5.1-buster as build-stage
WORKDIR /app
RUN npm cache clean --force --
RUN rm -fr node_modules
COPY . .
RUN npm install
RUN npm run build --prod
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.25
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
#COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
ADD /nginx.conf  /etc/nginx/conf.d/default.conf