var log = require('./messagelog').createLog();

log.getHistory();

log.logMessage({name:'Test', message:'BOOM!'});

