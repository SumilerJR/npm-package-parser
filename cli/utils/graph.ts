/*
 * @Author: 九日 mail@sumiler.com
 * @Date: 2023-08-25 23:10:19
 * @LastEditors: 九日 mail@sumiler.com
 * @LastEditTime: 2023-08-26 14:09:04
 * @FilePath: \NPM Package\bin\utils\graph.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Dictionary from "./dictionary";

export default class Graph {
    private vertices = [] // 用来存放图中的顶点
    private adjList: Dictionary // 用来存放图中的边
    constructor() {
        this.adjList = new Dictionary();
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
            const [sourceName, sourceVersion] = v.split(':');
            result.data.push({
                name: sourceName + '\n' + sourceVersion,
                version: sourceVersion,
                draggable: true,
                symbolSize: [80, 80],
            });
            if (this.adjList.get(v).length > 0) {
                this.adjList.get(v).forEach((n) => {
                    const [targetName, targetVersion] = n.split(':');
                    console.log(targetName, targetVersion, sourceName, sourceVersion);
                    result.links.push({
                        // target: n,
                        // source: v,
                        target: targetName + '\n' + targetVersion,
                        source: sourceName + '\n' + sourceVersion,
                        category: sourceVersion
                    });
                });
            }
        });
        return result;
    }
}
