oohlalog_winston
================

An OohLaLog Adapter for the Winston Logging Library in Node.js
# oohlalog_winston 
An OohLaLog transport for [winston][0].

## Motivation
To extend [winston][0] logging to OohLaLog.


## Usage
``` js
  var winston = require('winston');
  
  //
  // Requiring `winston-oohlalog` will expose 
  // `winston.transports.Riak`
  //
  require('winston-oohlalog').OohLaLog;
  
  winston.add(winston.transports.OohLaLog, options);
```


*Metadata:* Logged as JSON literal in Riak

## Installation

### Installing npm (node package manager)

``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing winston-oohlalog

``` bash
  $ npm install winston
  $ npm install winston-oohlalog
```


[0]: https://github.com/indexzero/winston
