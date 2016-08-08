'use strict';

const configA = require('./config.json');
const configB = require('nconf-test-b/config.json');
const { fork } = require('child_process');
const nconfTestA = require('./index');
const tape = require('tape');

let childProcess;

function maybeStopChildProcess() {
  if (childProcess) {
    childProcess.kill();
  }
}

process.on('uncaughtException', error => {
  maybeStopChildProcess();

  console.error(error);
  process.exit(1);
});

process.on('exit', maybeStopChildProcess);

tape('parent config smashes child', t => {
  t.deepEqual(
    nconfTestA,
    {
      a: configA,
      b: configB,
    }
  );
  t.end();
});

tape('CLI flags dominate', t => {
  const env = {
    test1: 'yolo',
    test2: 'pokemon',
  };
  let out;
  let err;

  t.plan(4);

  childProcess = fork('./index.js', {
    cwd: process.cwd(),
    env: Object.assign({}, process.env, env),
    silent: true,
  });

  childProcess.stdout.on('data', chunk => out += chunk.toString());
  childProcess.stderr.on('data', chunk => err += chunk.toString());

  childProcess.on('close', code => {
    t.notOk(code, 'exits with 0');
    t.notOk(err, 'nothing to stderr');

    // Some lib is logging `undefined`
    const parsed = JSON.parse(out.replace(/^undefined/, ''));


    t.deepEqual(parsed.a, env, 'env overrides A');
    t.deepEqual(parsed.b, env, 'env overrides B');
  });
});
