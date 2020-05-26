/**
 * Created by 337547038
 * 2019
 * https://github.com/337547038/Automated-build-tools-for-front-end
 */
const fs = require("fs");
const exec = require('child_process').exec;
const net = require('net');
const watch = require('./watch');
const os = require('os');
module.exports = function () {
  const config = JSON.parse(fs.readFileSync('./package.json'));
  let build = "";
  if (config.dist !== "") {
    build = '--content-base ' + config.dist + '/'
  }
  let serverIp = 'localhost';
  if(config.serverIp === true){
     serverIp = getIPAdress()
  }else if (config.serverIp !== "") {
    serverIp = config.serverIp
  }
  watch('server');
  const port = portIsOccupied(parseInt(config.port), serverIp, function (port) {
    const option = `webpack-dev-server ${build} --host ${serverIp} --port ${port} --mode development --config src/webpack/webpack.config.js`;
    exec(option, function (err, stdout, stderr) {
      if (err) {
        console.error(`exec error: ${err}`);
        return
      }
      console.log(`stdout: ${stdout}`)
    });
    const url = `http://${serverIp}:${port}/`;
    setTimeout(function () {
      console.log('\x1B[32m%s\x1B[39m', 'server running at ' + url);
      exec('start ' + url)// 打开浏览器窗口，设置延时打开窗口，很多时候服务还没启动，窗口就打开了，显示出错
    }, 3000)
  })
};

// 检测端口有没在使用
function portIsOccupied(port, url, callback) {
  const server = net.createServer().listen(port, url);
  //const server=net.createServer().listen(port)
  server.on('listening', () => {
    // console.log(`端口可用 ${port}`);
    server.close();
    // return port
    callback(port)
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      portIsOccupied(port + 1, url, callback); // 不可用时加1
      console.log(`this port ${port} is occupied.try another.`)
    }
  })
  // return port
}
// 获取本机ip地址
function getIPAdress() {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
