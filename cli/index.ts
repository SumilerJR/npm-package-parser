#!/usr/bin/env node
// 告诉操作系统用 Node 来运行此文件

/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-09 20:05:19
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-09-01 12:07:57
 * @FilePath: \NPM Package\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 引入依赖
import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from 'url';

import PackageNode from "./utils/packageNode.js";
import Graph from "./utils/graph.js";

// 使用fs.writeFile 方法写入JSON文件
import { writeFile } from 'fs';
// 导入web服务功能
import startServer from "./server.js";

const url = import.meta.url;

const __dirname = dirname(fileURLToPath(url));

const nodeModulesPath = path.resolve(__dirname, "../node_modules");

const graph = new Graph();


//const path = require("path");
// 获取当前包的package.json数据
const jsonFile = resolve(__dirname, '../package.json');
const packageJSON = getJSONFromFile(jsonFile);



function getJSONFromFile(filePath: string): any {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return JSON.parse(data);
}

function extractVersion(versionString: string) {
    return versionString.replace(/^[\^~><=]+/, "");
}

function parsePackageJSON(packageJSON: any, root?: PackageNode) {

    if (!packageJSON || !packageJSON.dependencies) return;

    const { name, version, dependencies, devDependencies } = packageJSON;

    // 添加当前节点到图中
    // graph.addVertex(name + ':' + extractVersion(version));
    graph.addVertex(name);

    // const dependencies = packageJSON.dependencies;

    // 遍历package中的dependencies项
    for (const [targetName, targetVersion] of Object.entries(dependencies)) {
        const nextPackageJSON = getPackageJSONByName(targetName);
        // console.log("nextPackageJSON", nextPackageJSON);

        // graph.addEdge(name + ':' + version, targetName + ':' + extractVersion(targetVersion as string));
        graph.addEdge(name, targetName);

        parsePackageJSON(nextPackageJSON);
    }

    // if (!devDependencies) return;

    // for (const [targetName, targetVersion] of Object.entries(devDependencies)) {
    //     const nextPackageJSON = getPackageJSONByName(targetName);
    //     graph.addEdge(name, targetName);
    //     parsePackageJSON(nextPackageJSON);
    // }

    return root;
}


function getPackageJSONByName(packageName: string) {
    let files = fs.readdirSync(nodeModulesPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)

    for (const file of files) {
        let filePath = path.resolve(nodeModulesPath, file, "package.json"); // 当前文件 | 文件夹的路径w

        // 满足查询条件文件
        if (file === packageName) {
            return getJSONFromFile(filePath);
        }
    }
}

parsePackageJSON(packageJSON, new PackageNode('npm-package-parser', '1.1.1'));
// console.log("root", JSON.stringify(root));
// console.log("result", result);
// console.log("@@@@@@@@graph\n", graph.toString());
console.log("@@@@@@@@toJSON\n", JSON.stringify(graph.toJSON()));


// 将结果输出到result.json
writeFile(path.resolve(__dirname, "../dist/result.json"), JSON.stringify(graph.toJSON(), null, 2), (error) => {
    if (error) {
        console.log('An error has occurred ', error);
        return;
    }
    console.log('Data written successfully to disk');
});

// 将html写入dist目录
const templatePath = path.resolve(__dirname, '../index.html'); // 模板文件的路径
const outputPath = path.resolve(__dirname, '../dist', 'index.html'); // 输出文件的路径

fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
    if (err) {
        console.error('Error reading template file:', err);
    } else {
        const renderedContent = templateContent;

        fs.writeFile(outputPath, renderedContent, 'utf-8', (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
                console.log('HTML file written successfully.');
                // 在这里启动 Web 服务器
                startServer();
            }
        });
    }
});

