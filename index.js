const _ = require('lodash');

const config = require('./config.json');
const util = require('./util');

const switches = _.forEach(config.switches, util.genSwitch);
const reads = _.forEach(config.reads, util.genRead(config.data));

async function runMain() {
  try {
    await util.checkGpio()
    await Promise.all(switches, util.setSwitch(1))
    await Promise.all(reads, util.testSignal)
    await Promise.all(switches, util.setSwitch(0))
  } catch (err) {
    util.handleError(config.error)(err)
  }
}

setInterval(runMain, config.interval);
