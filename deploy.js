var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

var config = {
  user: "admin",                   // NOTE that this was username in 1.x 
  password: "admin",           // optional, prompted if none given
  host: "192.168.0.110",
  port: 21,
  localRoot: __dirname + '/build',
  remoteRoot: '/',
  // include: ['*', '**/*'],      // this would upload everything except dot files
  include: ['*', 'build/*'],
  // exclude: ['build/**/*.map'],     // e.g. exclude sourcemaps
  //deleteRoot: true                // delete existing files at destination before uploading
}

// use with promises
// ftpDeploy.deploy(config)
//   .then(res => console.log('finished'))
//   .catch(err => console.log(err))

//use with callback
ftpDeploy.deploy(config, function (err) {
  if (err) console.log(err)
  else console.log('finished');
});