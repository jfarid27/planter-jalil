const fs = require('fs');
const GPIO = require('onoff').Gpio;
const _ = require('lodash');
const moment = require('moment');


const genSwitch = id => ({ dev: new GPIO(id, 'out'), id });

const genRead = _.curry((loc, id) => 
   ({ dev: (new GPIO(id, 'in')), id, loc }));


const writeAppend = (loc, data, cb) => 
  fs.writeFile(loc, `${moment().format()} ${data}\n`, { flag: 'a' }, cb);

const handleError = (loc, err) => writeAppend(
  `${loc}/errors.txt`, JSON.stringify(err),
  () => {}
);

const writeData = (loc, id, err, data) => (new Promise((res, rej) => 
  writeAppend(`${loc}/data-${id}.txt`, data, err => err ? rej(err) : res())
));


const testSignal = gpio => new Promise((res, rej) =>
  gpio.dev.read((err, data) =>
    (err) ? rej(err) : writeData(gpio.loc, gpio.id, err, data)
      .then(res)
      .catch(rej)));

const setSwitch = _.curry((setting, gpio) => (
  new Promise((res, rej) => gpio.dev.write(setting, err =>
    (err ? rej(err) : res())
  ))));

const checkGpio = () => (new Promise((res, rej) => 
  (GPIO.accessible ? res() : rej("GPIO Not Accessible"))));

module.exports = {
  checkGpio,
  genSwitch,
  genRead,
  setSwitch,
  testSignal,
  handleError
};
