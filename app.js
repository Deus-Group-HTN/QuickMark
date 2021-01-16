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

const spawn = require("child_process").spawn;
let {PythonShell} = require('python-shell')

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
	console.log("Connection made", new Date())

	var uploader = new siofu();
    uploader.dir = "./public/temp";
    uploader.listen(socket);

    uploader.on('complete', function (event) {

    	let studentName = 'Alex'

    	console.log(event.file.name)

    	let options = {
		  mode: 'text',
		  pythonOptions: ['-u'], // get print results in real-time
		  args: [event.file.name, studentName]
		};

		PythonShell.run('./python/main.py', options, function (err, results) {
		  if (err) throw err;
		  // results is an array consisting of messages collected during execution
		  console.log("Completed image processing");

		  fs.readdir(__dirname + '/public/questions/' + studentName, (err, files) => {
				if (err) {
					console.log("Error finding questions")
				} else {
					var oFiles = [];
					for (var i = 0; i < files.length; i++)
						oFiles.push(files[i])
					socket.emit('files', oFiles)
				}
			})
		});

		/*const pythonProcess = spawn('python',["./python/main.py", event.file.name, "Alex"]);

		pythonProcess.stdout.on('data', function(data) { 
	        console.log(data.toString())
	    } ) */

    })

    fs.readdir(__dirname + '/public/questions', (err, files) => {
		if (err) {
			console.log("Error finding questions")
		} else {
			var oFiles = [];
			for (var i = 0; i < files.length; i++)
				oFiles.push(files[i])
			socket.emit('files', oFiles)
		}
	})

	socket.on('disconnect', function () {

	});
});


module.exports = app;