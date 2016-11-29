#!/usr/bin/env node

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Debug = require("debug");
const http = require("http");

const app   = express(),
    debug   = Debug("node-init:server");

const routeHub = require("./features/hub/server/routes");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routeHub);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Normalize port
const port = ((value) => {
    const normalizedPort = parseInt(value, 10);

    // named pipe
    if (isNaN(normalizedPort)) {
        return value;
    }

    // port number
    if (normalizedPort >= 0) {
        return normalizedPort;
    }

    return false;
})(process.env.PORT || "3000");

// Get port from environment and store in Express.
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);

// Event listener for HTTP server "error" event.
server.on("error", (error) => {
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port  ${port}`;

    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;

    case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;

    default: throw error;
    }
});

// Event listener for HTTP server "listening" event.
server.on("listening", () => {
    const addr  = server.address(),
        bind    = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;

    debug(`Listening on ${bind}`);
});