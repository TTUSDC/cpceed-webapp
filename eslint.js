const exec = require('child_process').exec;

let cmd = 'node_modules\\.bin\\eslint --color --config';

switch (process.argv[2]) {
  case 'app':
    cmd += ' app.eslintrc.js';
    break;
  case 'api':
    cmd += ' api.eslintrc.js';
    break;
  default:
    cmd += ' app.eslintrc.js';
}

process.argv.slice(3).forEach((value) => {
  cmd += ` ${value}`;
});

exec(cmd, function(error, stdout, stderr) {
  console.log(stdout);
});
