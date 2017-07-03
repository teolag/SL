const express = require('express');
const app = express();
const routes = require('./routes');
const config = require('./config');

app.use(logger);
app.use(routes);




if(config.https) {
	const https = require('https');
	const fs = require('fs');
	const credentials = {
		cert: fs.readFileSync('../handla/server/cert.pem'),
		key: fs.readFileSync('../handla/server/key.pem')
	};
	https.createServer(credentials, app).listen(config.port, onListening);
} else {
	const http = require('http');
	http.createServer(app).listen(config.port, onListening);
}

process.on('exit', processEnded);

function logger(req, res, next) {
    console.log(req.method, 'REQUEST', req.url);
    next();
}

function onListening() {
	if(config.https) {
    	console.log('Listening on secure https server port: ' + config.port);
    } else {
    	console.log('Listening on http server port: ' + config.port);
    }
}

function processEnded(code) {
    console.log('Process ended', code, '\n \n \n');
}