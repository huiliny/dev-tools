/**
 * Created by 337547038
 * 2019
 * https://github.com/337547038/Automated-build-tools-for-front-end
 */
const fs = require('fs');
const copy = require('./copy');
module.exports = function () {
  const config = JSON.parse(fs.readFileSync('./package.json'));
  deleteFile(config.dist, config.dist); // 清空输出目录及所有文件
  deleteFile('src/static/css', 'src/static/css', 'map'); // 删除src目录css地图文件
  deleteFile('src/model/cache', 'src/model/cache'); // 清除所有缓存临时文件
  // 创建必须的文件夹
  mkdir('./' + config.dist);
  mkdir('./' + config.dist + '/static');
  mkdir('./' + config.dist + '/static/css');
  mkdir('./' + config.dist + '/static/img');
  copy('./src', "./" + config.dist, "build")
};

/* 创建目录 */
function mkdir(dst) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst)
  }
}

/* 清空输出目录及所有文件 */
function deleteFile(path, root, type) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFile(curPath, root)
      } else { // delete file
        if (type === 'map') {
          // 只删除.map文件
          if (curPath.indexOf('.css.map') !== -1) {
            fs.unlinkSync(curPath)
          }
        } else {
          fs.unlinkSync(curPath)
        }
      }
    });
    if (path !== root) {//要目录文件夹不删除
      fs.rmdirSync(path)
    }
  }
}
