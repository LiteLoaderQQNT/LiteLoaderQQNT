const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");


function getData(req) {
    const executor = (resolve, reject) => {
        const data = [];
        req.on("data", chunk => data.push(...chunk));
        req.on("end", () => {
            try {
                const data = new ArrayBuffer(data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    return new Promise(executor);
}



async function read_file_text(req, res) {
    const data = await getData(req);
    const text = new TextDecoder().decode(data);
    const json = JSON.parse(text);

    const file_path = path.join(__dirname, json["path"]);
    const readFile = fs.readFile(file_path, { encoding: "utf-8" });

    readFile.then(file => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(file);
    }).catch(err => {
        res.statusCode = 400;
        res.end();
        throw err;
    });
}


async function read_file_blob(req, res) {
    const data = await getData(req);
    const text = new TextDecoder().decode(data);
    const json = JSON.parse(text);

    const file_path = path.join(__dirname, json["path"]);
    const readFile = fs.readFile(file_path, { encoding: "binary" });

    readFile.then(file => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/octet-stream");
        res.end(file);
    }).catch(err => {
        res.statusCode = 400;
        res.end();
        throw err;
    });
}


// 请求监听器
function requestListener(req, res) {
    // 路由
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case "/api/fs/read_file_text": {
            read_file_text(req, res);
        } break;

        case "/api/fs/read_file_blob": {
            read_file_blob(req, res);
        } break;

        default: {
            res.end();
        } break;
    }
}


const server = http.createServer();
server.on("request", requestListener);
server.listen(0);


const BetterQQNT_API_HOST = server.address().address;
const BetterQQNT_API_PORT = server.address().port;


// 导出
module.exports = {
    BetterQQNT_API_HOST,
    BetterQQNT_API_PORT
}