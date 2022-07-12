FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD ./backend /usr/src/app
COPY ./static /usr/src/app/static
RUN npm config set registry https://registry.npm.taobao.org/ && \  
    npm i
EXPOSE 3000
CMD ["pm2-runtime", "start", "process.yml"]
