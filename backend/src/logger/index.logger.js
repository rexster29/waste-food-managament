const devLogger = require('./development.logger');
const uatLogger = require('./uat.logger');
const productionLogger = require('./production.logger');

let logger = null;

if (process.env.NODE_ENV === 'production') {
    logger = productionLogger();
}

if (process.env.NODE_ENV === 'uat') {
    logger = uatLogger();
}

if (process.env.NODE_ENV === 'dev') {
    console.log('2')
    logger = devLogger();
}

module.exports = logger;