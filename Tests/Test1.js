  var winston = require('winston');
  var oll = require('../src/winston-oohlalogTransport');


  // Tests to make sure that logging works when crossing the threshold.
  var logger = new winston.Logger({
    transports: [
    new (winston.transports.OohLaLog)({
      apiKey : "1f111a85-62c7-4f42-8dd9-8a10bb80dc6e",
      hostName: "Logger",
      level : "info",
      debug : true,
      timedFlush : -1, // Big number, won't flush due to time
      threshold : 25
    }),
    ]
  });

  for (var i = 0; i < 25; i++) {
    // Won't get logged because it is below the info level
    logger.log("debug", "DEBUG:"+i, { category : "category", details: "details"}); 
    // Won't get logged because it is below the info level
    logger.log("verbose", "VERBOSE:"+i, { category : "category", details: "details"});
    logger.log("info", "INFO:"+i, { category : "category", details: "details"});
    logger.log("warn", "WARN:"+i, { category : "category", details: "details"});
    logger.log("error", "ERROR:"+i, { category : "category", details: "details"});
  }

