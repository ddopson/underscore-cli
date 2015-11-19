FROM node
COPY . /source
RUN cd /source && npm install -g
ENTRYPOINT ["/usr/local/bin/underscore"]
