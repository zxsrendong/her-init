/**
 * @file index.js her project
 * @desc init a her project width PHP-AP
 * @author zhangxiaosong 278707632@qq.com
 */

let cli = module.exports = {};

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dirs = [
    'page',
    'resource',
    'resource/css',
    'resource/js',
    'resource/img',
    'widget'
];

const files = [
    'page/index.tpl',
    'resource/css/index.less',
    'resource/js/index.js',
    '.gitignore',
    'fis-conf.js',
    'BCLOUD',
    'smarty.conf',
    'build.sh'
];

cli.name = 'hi';
cli.info = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());

let projectName;
// 获取当前执行命令的文件件路径， 所有的操作应该基于此
let curPath = process.cwd();
let distPath = path.resolve(path.parse(__filename).dir, './dist');

function createDirs(projectName) {
    fs.mkdirSync(`${curPath}/${projectName}`);
    dirs.forEach((v, i) => {
        fs.mkdirSync(`${curPath}/${projectName}/${v}`);
    });
    copyFiles();
}

function copyFiles() {
    let baseFiles = fs.readdirSync(distPath);
    baseFiles.forEach((bf, i) => {
        if (bf === 'gitignore.txt') {
            fs.readFile(`${distPath}/${bf}`, 'utf8', (err, data) => {
                fs.writeFile(`${curPath}/${projectName}/.gitignore`, data, (err) => {
                    if (err) {
                        throw err;
                    }
                });
                counter();
            });
        } else {
            files.forEach((f, j) => {
                if (path.parse(f).base === bf) {
                    fs.readFile(`${distPath}/${bf}`, 'utf8', (err, data) => {
                        fs.writeFile(`${curPath}/${projectName}/${f}`, data.replace(/\$\{project\}/g, projectName), (err) => {
                            if (err) {
                                throw err;
                            }
                            counter();
                        });
                    });
                }
            });
        }
    });
}

let counter = (() => {
    let i = 0;
    return () => {
        if (files.length === ++i) {
            console.log('项目创建完毕！');
            process.exit(1);
        }
    }
})();


function createProject(projectName) {
    if (!fs.existsSync(distPath)) {
        console.log(`not exits source dist`);
        return false;
    }
    if (fs.existsSync(`${curPath}/${projectName}`)) {
        // console.log(`has exist ${projectName} dir`);
        rl.question('需要覆盖已有的项目文件吗？(Y/N):', (an) => {
            if (an.toLowerCase() === 'y') {
                createDirs(projectName);
            }
            rl.close();
        });
        return false;
    }
    createDirs(projectName);
}

cli.run = (cmd) => {
    if (!cmd) {
        console.log('缺少参数。请输入一个项目名');
    } else if ('-v' === cmd) {
        console.log(cli.info.version);
    } else if (/^[_a-zA-z]/.test(cmd)) {
        projectName = cmd;
        createProject(cmd);
    }
}
