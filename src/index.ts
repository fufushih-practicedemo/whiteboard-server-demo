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

    socket.on('element-update', (elementData) => {
        updateElementInElements(elementData);

        socket.broadcast.emit('element-update', elementData);
    })
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const updateElementInElements = (elementData: any) => {
    const index = elements.findIndex((element) => element.id === elementData.id);

    if(index === -1) return elements.push(elementData);

    elements[index] = elementData;
}