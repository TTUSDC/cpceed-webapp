const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

function WebpackWatchPlugin() {}

WebpackWatchPlugin.prototype.apply = (compiler) => {
  let child = null;

  compiler.plugin('emit', (compilation, callback) => {
    if (child !== null) {
      child.kill('SIGTERM');
    }

    callback();
  });

  compiler.plugin('done', () => {
    child = spawn('node', ['build/api.bundle.js']);

    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    child.on('exit', (code) => {
      console.log(`server exited with code: ${code}`);
    });
  });

  process.on('SIGINT', () => {
    const files = fs.readdirSync('build/');
    let filename;
    let stat;

    for (let i = 0; i < files.length; i += 1) {
      filename = path.resolve(__dirname, `../build/${files[i]}`);
      stat = fs.lstatSync(filename);

      if (stat.isFile()) {
        if (/.hot-update.json$/.test(filename)) {
          fs.unlinkSync(filename);
        } else if (/.hot-update.js$/.test(filename)) {
          fs.unlinkSync(filename);
        } else if (/.hot-update.js.map$/.test(filename)) {
          fs.unlinkSync(filename);
        }
      }
    }

    process.exit(0);
  });
};

module.exports = WebpackWatchPlugin;
