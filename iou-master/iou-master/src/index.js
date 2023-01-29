require('dotenv').config(); // Reads in environment variables, such as port and database credentials

const express = require('express');
const expressHistory = require('connect-history-api-fallback');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const db = require('./db');

app.use(express.json());

require('./routes')(app);

// If no other route is defined then return the public folder (frontend), must be last
const staticFileMiddleware = express.static('public');
app.use(staticFileMiddleware);
app.use(expressHistory());
app.use(staticFileMiddleware);

require('./chat')(io);

// Starts the server
http.listen(process.env.PORT, () => { console.log(`Listening on *:${process.env.PORT}`); });