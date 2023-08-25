#!/usr/bin/env node
// 告诉操作系统用 Node 来运行此文件

/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-09 20:05:19
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-08-10 17:30:42
 * @FilePath: \NPM Package\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 引入依赖
import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from 'url';

import PackageNode from "./utils/packageNode.js";
import Graph from "./utils/graph.js";

const url = import.meta.url;

const __dirname = dirname(fileURLToPath(url));

const nodeModulesPath = path.resolve(__dirname, "../node_modules");

const graph = new Graph();


//const path = require("path");
// 获取当前包的package.json数据
const jsonFile = resolve(__dirname, '../package.json');
const packageJSON = getJSONFromFile(jsonFile);

const result = {};

function getJSONFromFile(filePath) {
    const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
    return JSON.parse(data);
}

function parsePackageJSON(packageJSON, root) {

    if (!packageJSON || !packageJSON.dependencies) return;

    // console.log("packageJSON", packageJSON);
    console.log("packageJSON.dependencies", packageJSON.dependencies);

    // 添加当前节点到图中
    graph.addVertex(packageJSON.name);

    const dependencies = packageJSON.dependencies;

    // 遍历package中的dependencies项
    for (const [name, version] of Object.entries(dependencies)) {
        const nextPackageJSON = getPackageJSONByName(name);
        // console.log("nextPackageJSON", nextPackageJSON);

        graph.addEdge(packageJSON.name, name);

        parsePackageJSON(nextPackageJSON);

        // if (result[name] == null) {
        //     result[name] = version;
        //     const packageNode = new PackageNode(name, version);
        //     root.dependencies.push(packageNode);
        //     parsePackageJSON(nextPackageJSON, packageNode);
        // }
    }
    return root;
}


function getPackageJSONByName(packageName) {
    let files = fs.readdirSync(nodeModulesPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)

    for (const file of files) {
        let filePath = path.resolve(nodeModulesPath, file, "package.json"); // 当前文件 | 文件夹的路径

        // 满足查询条件文件
        if (file === packageName) {
            return getJSONFromFile(filePath);
        }
    }
}

const root = parsePackageJSON(packageJSON, new PackageNode('root', '1.1.1'));
console.log("root", JSON.stringify(root));
console.log("result", result);
console.log("@@@@@@@@graph\n", graph.toString());
console.log("@@@@@@@@toJSON\n", graph.toJSON());

function init() {
    const root = parsePackageJSON(packageJSON, new PackageNode('root', '1.1.1'));
    return root;
}


// export { init };