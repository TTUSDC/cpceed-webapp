const fs = require('fs');
const chokidar = require('chokidar');
const spawn = require('child_process').spawn;

const bundle = 'build/api.bundle.js';
let watcher;
let child;
let running = false;

function start() {
  if (running === false) {
    child = spawn('node', [bundle]);
    running = true;

    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    child.on('exit', (code) => {
      running = false;

      console.log(`server exited with code: ${code}`);
    });
  }
}

function stop() {
  if (running === true) {
    child.kill('SIGTERM');
    running = false;
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
