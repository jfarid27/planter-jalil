const _ = require('lodash');

const config = require('./config.json');
const util = require('./util');

const switches = _.forEach(config.switches, util.genSwitch);
const reads = _.forEach(config.reads, util.genRead);

const runMain = (switches, readIds) => () => 
  util.checkGpio()
    .then(() => Promise.all(switches, util.turnOnSwitch))
    .then(() => util.testSignal(reads))
    .catch(util.handleError(config.error));

setInterval(runMain(switches, reads), config.interval);
