FROM node:22
WORKDIR /app
COPY package.json /app
RUN npm install --ignore-scripts
COPY . /app/
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
EXPOSE 3000
CMD ["npm", "run", "docker-start"]
