import path from "path";
import express from "express";
import http from "http";
import socketio from "socket.io";

// load local env-vars
import "./config";

const { PORT } = process.env;

const app = express();
const server = http.createServer(app);
const socket = socketio(server);

let sharedCode =
    'const b = []\n\nfor (let idx = 0; idx < 1000000; idx++) {\n\tb.push("BBBBBBBBBB".toLowerCase() === "bbbbbbbbbb")\n}\n\n/*===*/\n\nconst a = []\n\nfor (let idx = 0; idx < 1000000; idx++) {\n\ta.push("aaaaaaaaaa".toUpperCase() === "AAAAAAAAAA")\n}\n\n/*===*/\n\n1 + 2\n\n/*===*/\n\n// error\na + b';

const clientRequestIndex = {};

socket.on("connection", (client) => {
    console.log(`Nova conexão: ${client.id}`);

    const loginData = {
        userId: client.id,
        sharedCode,
    };

    clientRequestIndex[client.id] = 0;

    client.emit("login", loginData);

    client.broadcast.emit("new-user", client.id);

    client.on("edit-code", (editData) => {
        if (editData.index > clientRequestIndex[client.id]) {
            sharedCode = editData.code;
            clientRequestIndex[client.id] = editData.index;
            client.broadcast.emit("edit-code", editData.code);
        }
    });
});

app.use(express.static("../frontend/build"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
