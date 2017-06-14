const fs = require('fs');
const chokidar = require('chokidar');
const spawn = require('child_process').spawn;
const ps = require('ps-node');

const bundle = 'build/api.bundle.js';
let watcher;
let child;
let pid;

function isRunning() {
  ps.lookup({ pid }, (err, resultList) => {
    if (err) {
      console.log('Couldn\'t lookup process');
    }

    let output;

    if (resultList[0]) {
      output = true;
    } else {
      output = false;
    }

    return output;
  });
}

function start() {
  if (!isRunning()) {
    child = spawn('node', [bundle]);
    pid = child.pid;

    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    child.on('exit', (code) => {
      console.log(`server exited with code: ${code}`);
    });
  }
}

function stop() {
  if (isRunning()) {
    child.kill('SIGTERM');
  }
}

function initialize() {
  start();
  watcher = chokidar.watch(bundle, {
    persistent: true,
  });

  watcher.on('change', () => {
    stop();
    start();
  });
}

if (fs.existsSync(bundle)) {
  initialize();
} else {
  const initial = chokidar.watch('build', {
    persistent: true,
  });

  initial.on('add', () => {
    if (fs.existsSync(bundle)) {
      initialize();

      initial.close();
    }
  });
}

process.on('SIGINT', () => {
  stop();

  process.exit(0);
});
