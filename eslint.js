const exec = require('child_process').exec;

const base = 'node_modules\\.bin\\eslint --color --config';
let cmd = null;

switch (process.argv[2]) {
  case 'app':
    cmd = `${base} app.eslintrc.js ${process.argv[3]}`;
    break;
  case 'api':
    cmd = `${base} api.eslintrc.js ${process.argv[3]}`;
    break;
  default:
    cmd = `${base} app.eslintrc.js ${process.argv[3]}`;
}

exec(cmd, function(error, stdout, stderr) {
  console.log(stdout);
});
