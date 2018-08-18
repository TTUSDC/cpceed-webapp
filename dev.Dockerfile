FROM node:10.9.0-alpine

WORKDIR /usr/cpceed
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# TODO: replace dotenv
# `db` references the database emulator
# ENV MONGODB_URI=db:8082/test SECRET=thisisoursecret SALT=10

EXPOSE 3000

CMD ["npm", "start"]
