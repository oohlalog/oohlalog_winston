var util = require('util');
var winston = require('winston');
var http = require('http');
var events = require('events');

var OohLaLog = winston.transports.OohLaLog = function (options) {
  options = options || {};
  if (!options.apiKey){
    throw "winston-oohlalog requires 'apikey' property";
  }

  this.name = 'OohLaLog';
  this.agent = 'winston';
  this.level = options.level || 'info';
  this.apiKey = options.apiKey;
  this.hostName = options.hostName;
  this.threshold = options.threshold || 150;
  this.maxBuffer = options.maxBuffer || 2000;
  this.timedFlush = options.timedFlush || 10000;
    this.host = 'api.oohlalog.com' //localhost
    this.port = 80 // 8196;
    this.path = '/api/logging/save.json';
    this.debug = options.debug || false;
    this.logs = [];
    this.timeout = null;
    this.isTimerStarted = false;
};

function flushBuffer(timeExp) {
  self = this;
  console.log(this.logs.length)
  var batch = [];
  var length = self.logs.length;
  if (length == 0) {
    clearInterval(self.timeout);
    self.isTimerStarted = false;
    return;
  }

  if (self.debug) { 
    if (timeExp) { console.log('>>>>>Flushing ' + length + ' logs from time threshold.'); }
    else { console.log('>>>>>Flushing ' + length + ' logs from quantity threshold.'); }
  }

  for (var i = 0; i < length; i++) {
    batch.push(self.logs.shift());
  }

  var payload = JSON.stringify({
    apiKey: self.apiKey,
    logs: batch
  });

  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
    };

    var options = {
      host: self.host,
      port: self.port,
      apiKey: self.apiKey,
      path: self.path + '?apiKey=' + self.apiKey,
      method: 'POST',
      headers: headers
    };

    callback = function(response) {
      response.setEncoding('utf-8');
      var str = ''

      response.on('data', function(chunk) {
        str += chunk;

        // Add logs back in if fail
        if (response.statusCode != '200') {
          self.logs = batch.concat(self.logs);
        }
      });

      response.on('end', function() {
        var resultObject = str;
        if(self.debug) { 
          console.log('>>>>>Payload: ' + payload);
          console.log('>>>>>Response: ' + str); 
        }
      });
    }

  // Setup the request.  The options parameter is
  // the object we defined above.
  var req = http.request(options, callback);
  req.on('error', function(e) {
      // TODO: Below is a decent way to handle errors.  Make it better.
      self.logs = batch.concat(self.logs);
      clearInterval(self.timeout);
      self.isTimerStarted = false;
      console.log(e);
    });

  req.write(payload);
  req.end();
}


// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
util.inherits(OohLaLog, winston.Transport);


function addToBuffer(log) {
  this.logs.push(log);

  // If the size surpasses maxBuffer, drop oldest log
  if (this.logs.length > this.maxBuffer) {
    this.logs.shift();
  }
}


function checkBufferSize() {
  if (this.logs.length == 0) {
    return;
  }
  else if ( (this.logs.length >= this.threshold) && (this.logs.length > 0)) {
   this.flushBuffer(false);
  }
}


function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}


function log(level, msg, meta, callback) {
  if (!this.isTimerStarted && this.timedFlush > 0) {
    this.isTimerStarted = true;
    var self = this;
    this.timeout = setInterval(
      function() { 
        self.flushBuffer(self, true);
      }, 
      self.timedFlush); 
  }
  var log = {
    level     : level,
    message   : msg,
    timestamp : Date.now(),
    agent : this.agent,
    hostName : this.hostName,
  };
   
  // Records category data (if present)
  if (meta.category) {
    log.category = meta.category;
    delete meta.category;
  }
  
  // Records details (if present)
  if (meta.details) {
    log.details = meta.details;
    delete meta.details;
  }

  // Records all other metadata (if present)
  if (!isEmpty(meta)) {
    log.details += '\nMetadata: ' + JSON.stringify(meta);
  }

  this.addToBuffer(log);
  this.checkBufferSize(this);
  callback(null, true);
};

OohLaLog.prototype.log = log;
OohLaLog.prototype.checkBufferSize = checkBufferSize;
OohLaLog.prototype.addToBuffer = addToBuffer;
OohLaLog.prototype.flushBuffer = flushBuffer;


//Define as a property of winston transports for backward compatibility
winston.transports.OohLaLog = OohLaLog;
module.exports = OohLaLog;

//The rest of winston transports uses (module).name convention
//Create a field to allow consumers to interact in the same way
module.exports.OohLaLog = OohLaLog;
