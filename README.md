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
  require('winston-oohlalog').OohLaLog;
  
  winston.add(winston.transports.OohLaLog, options);
```
The MongoDB transport takes the following options. apiKey' and hostName' are required:

* __apiKey:__ Your OohLaLog API key
* __hostName:__ Your OohLaLog API key
* __level:__ Level of messages that this transport should log, defaults to 'info'.
* __debug:__ Boolean flag indicating whether to show output, defaults to false.

* __timedFlush:__ The time interval(milliseconds) at which you would like logs to be automatically flushed to OLL server, defaults to 10000.
* __threshold__: The maximum number of logs you want to be buffered before being automatically flushed to OLL server, defaults to 150.

*Notice:* __apiKey__ and __hostName__ are required. 


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
