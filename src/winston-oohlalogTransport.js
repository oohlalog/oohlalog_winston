var util = require('util');
var winston = require('winston');
var http = require('http');

var OohLaLog = winston.transports.OohLaLog = function (options) {
  options = options || {};
  if (!options.apiKey){
    throw "winston-oohlalog requires 'apikey' property";
  }

  if (!options.hostName){
    throw "winston-oohlalog requires 'hostName' property";
  }


  this.name = "OohLaLog";
  this.level = options.level || 'info';
  this.apiKey = options.apiKey;
  this.hostName = options.hostName;
  this.threshold = options.threshold || 100;
  this.timedFlush= options.timedFlush || 1000;
    this.host = "localhost" //"api.oohlalog.com"
    this.port = 8196 //80;
    this.path = "/api/logging/save.json";
    this.debug = options.debug || false;
    this.logs = [];
    this.timeout = null;
    this.isTimerStarted = false;
  };

  // Inherit from `winston.Transport` so you can take advantage
  // of the base functionality and `.handleExceptions()`.
  util.inherits(OohLaLog, winston.Transport);

  var flushBuffer = function(oll, timeExp) {
    var batch = [];
    var length = oll.logs.length;
    if (length == 0) {
      clearInterval(oll.timeout);
      this.isTimerStarted = false;
      return;
    }

    if (oll.debug) { 
      if (timeExp) { console.log("Flushing " + length + " logs from time threshold."); }
      else { console.log("Flushing " + length + " logs from quantity threshold."); }
    }

    for (var i = 0; i < length; i++) {
      batch.push(oll.logs.shift());
    }

    var payload = JSON.stringify({
      apiKey: oll.apiKey,
      logs: batch,
    });

    var headers = {
      'Content-Type': 'application/json',
      // 'Content-Length': payload.length
    };

    var options = {
      host: oll.host,
      port: oll.port,
      apiKey: oll.apiKey,
      path: [oll.path, "?apiKey=", oll.apiKey].join(""),
      method: "POST",
      headers: headers
    };

    // Setup the request.  The options parameter is
    // the object we defined above.
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');
      var responseString = '';

      res.on('data', function(data) {
       responseString += data;
     });

      res.on('end', function() {
        var resultObject = responseString;
        if(oll.debug) { 
          console.log(payload);
          console.log(responseString); 
        }
      });
    });
    req.on('error', function(e) {
     // TODO: handle error.
   });

    req.write(payload);
    req.end();
  }


  var checkBufferSize = function(oll) {
    if (oll.logs.length == 0) {
      return;
    }

    if (oll.logs.length >= oll.threshold && oll.logs.length > 0) {
      flushBuffer(oll, false);
    }
  }


  OohLaLog.prototype.log = function (level, msg, meta, callback) {
    if (!this.isTimerStarted && this.timedFlush > 0) {
      this.isTimerStarted = true;
      var self = this;
      this.timeout = setInterval(
        function(){ 
          flushBuffer(self, true);
        }, 
        self.timedFlush); 
    }
    var data = {
      level     : level,
      message   : msg,
      timestamp : Date.now(),
      agent : this.hostName
    };

    if (meta.category) {
      data.category = meta.category;
    }

    if (meta.details) {
      data.details = meta.details;
    }

    this.logs.push(data);
    // if (debug) {
    //   console.log(msg);
    // }
    checkBufferSize(this);
    callback(null, true);
  };

//Define as a property of winston transports for backward compatibility
winston.transports.OohLaLog = OohLaLog;
module.exports = OohLaLog;

//The rest of winston transports uses (module).name convention
//Create a field to allow consumers to interact in the same way
module.exports.OohLaLog = OohLaLog;


