# oohlalog_winston 
An OohLaLog transport for [winston][0] logging in Node.js.

## Motivation
To extend [winston][0] logging to OohLaLog.


## Usage
``` js
  var winston = require('winston');
  
  //
  // Requiring `winston-oohlalog` will expose 
  // `winston.transports.OohLaLog`
  //
  var OohLaLog = require('winston-oohlalog').OohLaLog;
  
  winston.add(OohLaLog, options);
```
The OohLaLog transport takes the following options.

* __apiKey:__ Your OohLaLog API key
* __hostName:__ The host name of your application
* __level:__ Level of messages that this transport should log, defaults to 'info'.
* __debug:__ Boolean flag indicating whether to show debugging output, defaults to false.

* __timedFlush:__ The time interval(milliseconds) at which you would like logs to be automatically flushed to OLL server, defaults to 10000.
* __threshold__: The maximum number of logs you want to be buffered before being automatically flushed to OLL server, defaults to 150.

*Notice:* __apiKey__ is required. 


*Metadata:* If metadata contains the key "category" then this is stored in the log's category attribute. All else is logged as JSON literal in the log's details section.

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
