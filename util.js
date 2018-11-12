const fs = require('fs');
const GPIO = require('onoff').Gpio;
const _ = require('lodash');
const moment = require('moment');

const writeAppend = (loc, data, cb) => 
  fs.writeFile(loc, `${moment().format()} ${data}\n`, { flag: 'a' }, cb);

const handleError = _.curry((loc, err) => writeAppend(
  `${loc}/errors.txt`, JSON.stringify(err), () => {}));

const genSwitch = id => (new GPIO(id, 'out'));

const genRead = id => ({ dev: (new GPIO(id, 'in')), id });

const writeData = _.curry((id, err, data) => (new Promise((res, rej) => 
  writeAppend(`${config.data}/data-${id}.txt`, data, err => err ? rej(err) : res())
)));

const testSignal = gpio => new Promise((res, rej) =>
  gpio.dev.read((err, data) =>
    (err) ? rej(err) : writeData(gpio.id, err, data)
      .then(res)
      .catch(rej)));

const turnOnSwitch = sw => (
  new Promise((res, rej) => sw.write(1, err =>
    (err ? rej(err) : res)
  )));

const checkGpio = () => (new Promise((res, rej) => 
  (GPIO.accessible ? res() : rej("GPIO Not Accessible"))));

module.exports = {
  checkGpio,
  genSwitch,
  genRead,
  turnOnSwitch,
  testSignal,
  handleError
};
