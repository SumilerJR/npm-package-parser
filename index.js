/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-31 16:41:41
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-08-31 17:09:45
 * @FilePath: \npm-package-parser\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// const fs = require('fs');
// const path = require('path');

import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from 'url';

function scanNodeModules(directory) {
    const packages = {};

    // 递归扫描目录
    function scanDir(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // 如果是目录，则递归扫描
                scanDir(filePath);
            } else {
                // 如果是文件，则判断是否是 package.json
                if (file === 'package.json') {
                    const packagePath = filePath;
                    console.log(packagePath);
                    // const packageData = require(packagePath);
                    const packageFile = fs.readFileSync(packagePath, { encoding: 'utf-8' });
                    const packageData = JSON.parse(packageFile);
                    if (packageData && packageData.name) {
                        const packageName = packageData.name;
                        const packageInfo = {
                            version: packageData.version,
                            description: packageData.description,
                            homepage: packageData.homepage
                        };
                        packages[packageName] = packageInfo;
                    }
                }
            }
        });
    }

    scanDir(directory);
    return packages;
}

// 获取当前文件的目录路径
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
// 调用示例
const nodeModulesDirectory = path.join(currentDirPath, 'node_modules');
const packages = scanNodeModules(nodeModulesDirectory);
console.log(packages);