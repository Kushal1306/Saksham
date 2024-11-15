import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
// import { handleWebSocketConnection } from './routes/NayaRoute.js';
import {handleWebSocketConnection} from './routes/supernew.js';
import connectToDB from './config/db.js';
import cors from 'cors';
import { convertDate } from './config/dateHelper.js';
import mainRouter from './routes/index.js';

const app = express();
const port = 3000;

app.use(cors({
  origin: '*', // Replace with specific origin if needed for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json());
app.use(mainRouter);


// const currentDate = new Date(); 
// console.log(convertDate("27/10/2024 10:30"));
// Initialize HTTP server
const server = http.createServer(app);


// Initialize WebSocket server
const wss = new WebSocketServer({ server });
connectToDB();
// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  handleWebSocketConnection(ws, req);
});

// Example route
app.get('/', (req, res) => {
  res.send('Express server with WebSocket is running!');
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
