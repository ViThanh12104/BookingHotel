import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";

import viewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import connectDB from "./config/connectDB";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

require("dotenv").config();

let app = express();
 
// Thay vì để cứng localhost, hãy sử dụng biến môi trường
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// STATIC IMAGE

app.use(

    "/images",

    express.static("src/public/images")
);

viewEngine(app);
initWebRoute(app);

// Error Handling Middleware (MUST be AFTER all routes)
app.use(notFoundHandler); // 404 handler
app.use(errorHandler);    // Global error handler

let port = process.env.PORT || 8080;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
});

app.locals.io = io;

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Trong server.js
const startServer = async () => {
    try {
        await connectDB(); // Chờ kết nối database thành công
        httpServer.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to database:", error);
        process.exit(1); // Dừng app nếu không kết nối được DB
    }
};

startServer();