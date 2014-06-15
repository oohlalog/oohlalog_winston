  var winston = require('winston');
  var oll = require('./src/winston-oohlalogTransport');


  // Tests to make sure that logging works when crossing the threshold.
  var logger = new winston.Logger({
    transports: [
    new (winston.transports.OohLaLog)({
      apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
      hostName: "Logger",
      level : "verbose",
      debug : true,
      timedFlush : -1, // Big number, won't flush due to time
      threshold : 100
    }),
    ]
  });

  for (var i = 0; i < 150; i++) {
    logger.log("info", ""+i, { category : "category", details: "details"});
  }

    // Tests to make sure that nothing gets logged when time is off and 
    // number of logs does not reach threshold.
  var logger = new winston.Logger({
    transports: [
    new (winston.transports.OohLaLog)({
      apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
      hostName: "Logger",
      level : "verbose",
      debug : true,
      timedFlush : -1, // Negative value turns it off
      threshold : 200
    }),
    ]
  });

  for (var i = 0; i < 150; i++) {
    logger.log("info", ""+i, { category : "category", details: "details"});
  }

  // Tests to make sure that logging occurs after correct time interval
  var logger = new winston.Logger({
    transports: [
    new (winston.transports.OohLaLog)({
      apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
      hostName: "Logger",
      level : "verbose",
      debug : true,
      timedFlush : 1000, // Big number, won't flush due to time
      threshold : 151
    }),
    ]
  });

  for (var i = 0; i < 150; i++) {
    logger.log("warn", ""+i, { category : "category", details: "details"});
  }