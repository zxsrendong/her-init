/**
 * @file index.js her project
 * @desc init a her project width PHP-AP
 * @author zhangxiaosong 278707632@qq.com
 */

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let projectName;
// 获取当前执行命令的文件件路径， 所有的操作应该基于此
let curPath = process.cwd();
let distPath = path.resolve(path.parse(__filename).dir, './dist');

console.log(`curPath:${curPath}`);
console.log(`distPath:${distPath}`);
// 创建文件读取流, 进行项目名称替换
function replaceProjectName(path, projectName) {
    let result = '';
    let readStream = fs.createReadStream(path);
    readStream.on('open', (fd) => {
        console.log(`fd:${fd}`);
    });
    readStream.on('data', (data) => {
        let fileStr = data.toString();
        result += fileStr.replace(/\$\{project\}/g, projectName);
    });
    readStream.on('end', () => {
        console.log('文件读取结束');
        fs.writeFile(path, result, (err) => {
            if (err) {
                console.log('文件写入失败!');
                throw err;
            }
            console.log('文件写入成功');
        });
    });
    readStream.on('close', () => {
        console.log('文件关闭');
    });
    readStream.on('error', function (err) {
        console.error(err);
    });
}

function copyFiles() {
    exec(`cp -rf ${distPath}/ ${projectName}`, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        findFile('index.tpl');
        findFile('fis-conf.js');
    });
}

function findFile(fileName) {
    console.log(`shell: find ${curPath}/${projectName} -name ${fileName}`);
    exec(`find ${curPath}/${projectName} -name ${fileName}`, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(`stdout:${stdout}`);
        if (stdout) {
            replaceProjectName(stdout.trim(), projectName);
        } else {
            console.log('no such file here!');
        }
    });
}


rl.question('请输入项目名（仅支持英文）：', (answer) => {
    projectName = answer;
    rl.pause();
    if (!fs.existsSync(distPath)) {
        console.log(`not exits source dist`);
        return false;
    }
    if (fs.existsSync(`${curPath}/${projectName}`)) {
        console.log(`has exist ${projectName} dir`);
        rl.question('需要覆盖已有的项目文件吗？(Y/N):', (an) => {
            if (an.toLowerCase() === 'y') {
                copyFiles();
            }
            rl.close();
        });
        return false;
    }
    copyFiles();
});

