const spawn = require('child_process').spawn;

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
    process.exit(0);
  });
};

module.exports = WebpackWatchPlugin;
