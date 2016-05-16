global.glad = require('glad');
global.should = require('should');
global.assert = require('assert');
process.env.test = true;
glad.server(function(app, express, server) {});