const _ = require('lodash');

const config = require('./config.json');
const util = require('./util');

const switches = _.forEach(config.switches, util.genSwitch);
const reads = _.forEach(config.reads, util.genRead);

const runMain = () => util.checkGpio()
    .then(() => Promise.all(switches, util.turnOnSwitch))
    .then(() => Promise.all(reads, util.testSignal))
    .catch(util.handleError(config.error));

setInterval(runMain, config.interval);
