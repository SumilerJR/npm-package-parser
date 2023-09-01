import express from 'express';
// 引入依赖
import fs from "fs";
import path, { dirname, resolve } from "path";

import open from 'open';


export default function startServer() {
    // 在此处添加启动 Web 服务器的代码，可以使用之前提到的 Express 示例代码
    const app = express();
    const port = 3000; // 选择一个可用的端口号
    const staticDir = path.resolve(__dirname, '../dist'); // 替换为您希望公开的目录路径

    app.use(express.static(staticDir));

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
        // 在启动后自动打开目标 Web 地址
        open(`http://localhost:${port}/`);
    });
}