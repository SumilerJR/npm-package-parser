/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-09 20:05:19
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-08-10 10:17:26
 * @FilePath: \NPM Package\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 引入依赖
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.resolve(__dirname, "node_modules");


class PackageNode {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.dependencies = [];
    }

    toString() {
        // return '(' + this.x + ', ' + this.y + ')';
    }

}




// 获取当前包的package.json数据
const package = require('./package.json');

const result = {};



function parsePackageJSON(packageJSON, root) {

    if (!packageJSON || !packageJSON.dependencies) return;

    // console.log("packageJSON", packageJSON);
    console.log("packageJSON.dependencies", packageJSON.dependencies);

    const dependencies = packageJSON.dependencies;

    // 遍历package中的dependencies项
    for (const [name, version] of Object.entries(dependencies)) {
        const nextPackageJSON = getPackageJSONByName(name);
        // console.log("nextPackageJSON", nextPackageJSON);
        if (result[name] == null) {
            result[name] = version;
            const packageNode = new PackageNode(name, version);
            root.dependencies.push(packageNode);
            parsePackageJSON(nextPackageJSON, packageNode);
        }
    }
    return root;
}


function getPackageJSONByName(packageName) {
    let files = fs.readdirSync(nodeModulesPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)

    for (const file of files) {
        let filePath = path.resolve(nodeModulesPath, file, "package.json"); // 当前文件 | 文件夹的路径

        // 满足查询条件文件
        if (file === packageName) {
            return require(filePath);
        }
    }
}

const root = parsePackageJSON(package, new PackageNode('root', '1.1.1'));
console.log("root", JSON.stringify(root));
console.log("result", result);
