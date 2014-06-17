  var winston = require('winston');
  var oll = require('../src/winston-oohlalogTransport');


winston.add(oll, {
  apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
      hostName: "Logger",
      level : "verbose",
      debug : true,
      timedFlush : 10, 
      threshold : 10
    });

// var logger = new winston.Logger({
//   transports: winston.transports.oll});

  for (var i = 0; i < 10; i++) {
    winston.log("warn", i, { category : "category", details: "details", curious: "I am"});
  }