import Dictionary from "./dictionary.js";

export default class Graph {
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
                        category: "版本信息"
                    });
                });
            }
        });
        return result;
    }
}
