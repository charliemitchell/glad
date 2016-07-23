process.env.test = true;
global.glad = require('glad');
global.should = require('should');
global.assert = require('assert');
glad.server(function(app, express, server) {});