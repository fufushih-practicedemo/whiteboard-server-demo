import { createServer } from "http";
import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors());

let elements: any[] = [];

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket: Socket) => {
    console.log("user connected");
    io.to(socket.id).emit("whiteboard-state", elements);
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});