'use strict';

const nconfTestB = require('nconf-test-b');
const nconf = require('nconf');

nconf.argv().env().file({ file: './config.json' });

const nconfTestA = {
  a: {
    test1: nconf.get('test1'),
    test2: nconf.get('test2'),
  },
  b: nconfTestB,
};

// http://stackoverflow.com/a/6398335
if (require.main === module) {
  console.log(JSON.stringify(nconfTestA));
}

module.exports = nconfTestA;
