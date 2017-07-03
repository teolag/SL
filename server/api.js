const http = require('http');
const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/departures/:siteId', (req, res) => {
	const host = 'api.sl.se',
		  path = '/api2/realtimedeparturesV4.json',
	      params = {
	    	key: config.apiKeys.realtimeInformation,
	    	siteId: req.params.siteId,
	    	timewindow: 60
	      };
	get(host, path, params).then(data => res.json(data));
});

router.get('/search/:query', (req, res) => {
	const host = 'api.sl.se',
		  path = '/api2/typeahead.json',
		  params = {
			key: config.apiKeys.locationLookup,
			searchstring: req.params.query
			//stationsonly: false
		  };
	get(host, path, params).then(data => res.json(data));
});






module.exports = router;



function get(host, path, params) {
	return new Promise(function (resolve, reject) {
		path = path + '?' + toQueryString(params);
		http.get({host, path}, resp => {
		    let body = '';
		    resp.on('data', data => body += data);
		    resp.on('end', () => {
		        resolve(JSON.parse(body));
		    });
		    resp.on('error', err => console.error(err));
		});
	});
}

function toQueryString(obj) {
	return Object.keys(obj).map(function(key) {
    	return key + '=' + obj[key];
	}).join('&');
}