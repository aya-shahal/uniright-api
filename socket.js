const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


global.__basepath = process.cwd();

global.app = new require("express")();

require("./app");

require("./app/kernel");
require("./lib/helpers");
/* Configurations */
global.app.loadConfig();
global.app.loadModels();
const io = new Server(server,{
	//pingInterval: 30000,
	//pingTimeout: 10000,
	//allowEIO3: true,
	//	transports:['websocket'],
	//cors:true,
	cors: {
		origin: "*",
		//	origin: "https://cb-react-frontend.azurewebsites.net/",
		//	methods: ["GET", "POST"],
		//allowedHeaders: ["my-custom-header"],
		//credentials: true
	}
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

	console.log('a user connected');
	socket.join('room1');

	socket.on('disconnect', () => {
		console.log('user disconnected');
		socket.leave('room1');

	});

	socket.on('chat message', (msg, room) => {
		io.to(room).emit("reply",msg)
	});


	socket.on('toggletrun', async (data, room) => {
		room = "room1";


		console.log("toggletrun")
		io.to(room).emit("turnrecieved",data)
	});

	socket.on('broadcastprogress', async (data, room) => {
		room = "room1";

		console.log("broadcastprogress")
		// project id
		io.to(room).emit("broadcastprogressrecieved",data)
	});

});



server.listen(3085, () => {
	console.log('listening on *:3085');
});
