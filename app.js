// Initialize server variables
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const util = require('util');
var siofu = require("socketio-file-upload");
const options = {
	key: fs.readFileSync('./cert/ia.key'),
	cert: fs.readFileSync('./cert/server.crt'),
	ca: fs.readFileSync('./cert/ca.crt')
}

// Create HTTPS server
const server = https.createServer(options, app);
const path = require('path');
const readline = require('readline'); // Command line input
const io = require('socket.io')(server);
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const colors = require('colors');

// Create portf
const serverPort = process.env.PORT || 3007;
server.listen(serverPort, function () {
	console.log('Started an https server on port ' + serverPort);
})
const public = __dirname + '/public/';
app.use(siofu.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/*', function (req, res, next) {
	res.redirect('/')
	next()
})

let Files = {}

// Server-client connection architecture
io.on('connection', function(socket) {
	console.log("Connection made")

	var uploader = new siofu();
    uploader.dir = "./files";
    uploader.listen(socket);

	socket.on('disconnect', function () {

	});
});


module.exports = app;