  var winston = require('winston');
  var oll = require('./src/winston-oohlalogTransport');

  var logger = new winston.Logger({
  	transports: [
  	new (winston.transports.OohLaLog)({
  		apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
  		hostName: "Logger",
  		level : "verbose"
  	})
  	]
  });

for (var i = 1; i < 151; i++) {
	logger.log("verbose", ""+i, { category : "category", details: "bo$$"});
}