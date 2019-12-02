# base image
FROM node
# set working directory
WORKDIR /app
# copy the package.json and package-lock.json files to the work directory
COPY package.json package-lock.json ./
# run npm install to install all dependent packages
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
# copy your JavaScript source files
COPY . .
EXPOSE 80
EXPOSE 443
# start app
CMD ["npm", "start"]