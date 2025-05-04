import express from "express";
import { Server } from "socket.io";
import serveIndex from "serve-index";
import http from "node:http";
import path from "node:path";

import "./connectMongo.js";
import DeviceModel from "./DeviceModel.js";

const app = express();
const port = process.env.PORT;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const __dirname = import.meta.dirname;

app.use("/api/downloads",
    express.static("public/downloads"),
    serveIndex('public/downloads', { 
        icons: true,
        template: path.join(__dirname, 'public', 'views', 'files.html')
    }),
);
app.use(express.static("public"));

function registerDeviceAndEmit(socket) {
    socket.on("register", async (data) => {
        try {
            const device = await DeviceModel.findOne({ macAddress: data.macAddress });
            if (!device) await new DeviceModel({ ...data }).save();

            io.emit("OK");

            socket.on("vitals", (data) => {
                io.emit("vitals", { socketId: socket.id, info: data });
            });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log(socket.id, "got disconnected.");
        io.emit("clientDisconnect", socket.id);
    });
}

io.on("connection", (socket) => {
    console.log(socket.id, "is connected.");

    if (socket.handshake.auth.token != process.env.SOCKET_AUTH)
        return socket.disconnect();

    registerDeviceAndEmit(socket);
});

app.get("/api/devices", async (req, res) => {
    try {
        const { auth } = req.headers;
        
        if (!auth || auth != process.env.API_KEY)
            return res.status(401).json({ msg: "Access Denied" });

        const devices = await DeviceModel.find({});
        return res.status(200).json(devices);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server Error" });
    }
});

app.use('/', (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
});

httpServer.listen(port, () => {
    return console.log("Watchdog server running on", port);
});