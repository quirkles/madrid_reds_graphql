FROM node:19-alpine
WORKDIR /srv/app
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src/

RUN npm install
RUN npm run clean
RUN npm run build
RUN rm -rf src

ARG PORT=4400
ARG ENVIRONMENT='local'
ARG DATABASE_HOST='host.docker.internal'

EXPOSE $PORT
ENV ENVIRONMENT=$ENVIRONMENT
ENV DATABASE_HOST=$DATABASE_HOST

CMD ["node", "dist/index.js"]
