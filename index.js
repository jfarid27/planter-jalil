const _ = require('lodash');

const config = require('./config.json');
const util = require('./util');

const switches = _.map(config.switches, util.genSwitch);
const reads = _.map(config.reads, util.genRead(config.data));

async function runMain() {
  try {
    await util.checkGpio()
    await Promise.all(_.map(switches, util.setSwitch(1)));
    await Promise.all(_.map(reads, util.testSignal));
    await Promise.all(_.map(switches, util.setSwitch(0)));
  } catch (err) {
    util.handleError(config.error, err);
  }
}

setInterval(runMain, config.interval);
