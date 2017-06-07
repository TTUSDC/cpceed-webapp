const fs = require('fs');
const chokidar = require('chokidar');
const spawn = require('child_process').spawn;

const bundle = 'build/api.bundle.js';
let watcher;
let child = {};

function start(child) {
  if (child.exitCode !== null) {
    child = spawn('node', [bundle]);
    child.on('exit', () => {
      console.log('Child exited');
    });

    console.log('Child started');
  }

  return child;
}

function stop(child) {
  if (child.exitCode === null && child === null) {
    child.exit(0);

    console.log('Child stopped');
  }

  return child;
}

if (fs.existsSync(bundle)) {
  child = start(child);
  watcher = chokidar.watch(bundle, {
    persistent: true,
  });
  watcher.on('change', () => {
    child = stop(child);
    child = start(child);
  });
} else {
  const initial = chokidar.watch('build', {
    persistent: true,
  });

  initial.on('add', () => {
    if (fs.existsSync(bundle)) {
      child = start(child);
      watcher = chokidar.watch(bundle, {
        persistent: true,
      });
      watcher.on('change', () => {
        child = stop(child);
        child = start(child);
      });

      initial.close();
    }
  });
}

process.on('SIGINT', () => {
  child = stop(child);

  process.exit(0);
});
