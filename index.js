/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-09 20:05:19
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-08-10 17:30:42
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


class Dictionary {
    constructor() {
        this.items = {};
    }

    set(key, value) { // 向字典中添加或修改元素
        this.items[key] = value;
    }

    get(key) { // 通过键值查找字典中的值
        return this.items[key];
    }

    delete(key) { // 通过使用键值来从字典中删除对应的元素
        if (this.has(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    has(key) { // 判断给定的键值是否存在于字典中
        return this.items.hasOwnProperty(key);
    }

    clear() { // 清空字典内容
        this.items = {};
    }

    size() { // 返回字典中所有元素的数量
        return Object.keys(this.items).length;
    }

    keys() { // 返回字典中所有的键值
        return Object.keys(this.items);
    }

    values() { // 返回字典中所有的值
        return Object.values(this.items);
    }

    getItems() { // 返回字典中的所有元素
        return this.items;
    }
}


class Graph {
    constructor() {
        this.vertices = []; // 用来存放图中的顶点
        this.adjList = new Dictionary(); // 用来存放图中的边
    }

    // 向图中添加一个新顶点
    addVertex(v) {
        if (!this.vertices.includes(v)) {
            this.vertices.push(v);
            this.adjList.set(v, []);
        }
    }

    // 向图中添加a和b两个顶点之间的边
    addEdge(a, b) {
        // 如果图中没有顶点a，先添加顶点a
        if (!this.adjList.has(a)) {
            this.addVertex(a);
        }
        // 如果图中没有顶点b，先添加顶点b
        if (!this.adjList.has(b)) {
            this.addVertex(b);
        }

        this.adjList.get(a).push(b); // 在顶点a中添加指向顶点b的边
        // this.adjList.get(b).push(a); // 在顶点b中添加指向顶点a的边
    }

    // 获取图的vertices
    getVertices() {
        return this.vertices;
    }

    // 获取图中的adjList
    getAdjList() {
        return this.adjList;
    }

    toString() {
        let s = '';
        this.vertices.forEach((v) => {
            if (this.adjList.get(v).length > 0) {
                s += `${v} -> `;
                this.adjList.get(v).forEach((n) => {
                    s += `${n} `;
                });
                s += '\n';
            }
        });
        return s;
    }

    toJSON() {
        const result = {
            data: [],
            links: []
        };
        this.vertices.forEach((v) => {
            result.data.push({
                name: v,
                draggable: true,
                symbolSize: [80, 80],
            });
            if (this.adjList.get(v).length > 0) {
                this.adjList.get(v).forEach((n) => {
                    result.links.push({
                        target: n,
                        source: v,
                        // category: "版本信息"
                    });
                });
            }
        });
        return result;
    }
}

const graph = new Graph();



// 获取当前包的package.json数据
const packageJSON = require('./package.json');

const result = {};



function parsePackageJSON(packageJSON, root) {

    if (!packageJSON || !packageJSON.dependencies) return;

    // console.log("packageJSON", packageJSON);
    console.log("packageJSON.dependencies", packageJSON.dependencies);

    // 添加当前节点到图中
    graph.addVertex(packageJSON.name + '\n' + packageJSON.version);

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
            return require(filePath);
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