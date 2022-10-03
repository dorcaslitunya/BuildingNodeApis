const http = require('http');
const app = require('./app')

const port = process.env.PORT || 3000;

const server = http.createServer(app);


//listens to port and executes any code/listener  written and passedin createServer
server.listen(3000)