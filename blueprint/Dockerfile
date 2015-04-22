# Dockerfile (If you don't use docker, feel free to remove this file, or just ignore it)

# Version: 0.1
FROM ubuntu:14.04

RUN apt-get update

# install curl and git on ubuntu (I like to use nano, so we are installing that too)
RUN apt-get install -y curl git nano

# Install iojs (or change to nodejs if you prefer)
RUN curl -sL https://deb.nodesource.com/setup_iojs_1.x | bash - && apt-get install -y iojs

# Install forever (or other stuff)
RUN npm install -g forever

# Create /var/www Directory
RUN mkdir -p /var/www/

# Copy the package.json over
COPY src/package.json /var/www/

# Install Dependencies
RUN cd /var/www && npm install

# Copy Over The Application Code
COPY src/* /var/www/

# Additional Environmental Variable (Define if you would like)
ENV LOCALKEY mylocalkey

# Use process.env.LOCALHOST
ENV LOCALHOST http://172.17.42.1

# if (process.env.ENVIRONMENT === 'production') { do stuff }
ENV ENVIRONMENT production

# Run the App in var/www 
WORKDIR /var/www/
CMD ["node", "app.js"]

# Expose the Port
EXPOSE 4242 #ns-port
