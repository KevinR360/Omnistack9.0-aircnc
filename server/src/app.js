import 'dotenv/config';

import Youch from 'youch';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';

import socketio from 'socket.io';
import http from 'http';

import routes from './routes';

// Uncomment this line to enable database access
// --------
import './database';

class App {
  constructor() {
    this.server = express();
    this.app = http.Server(this.server);
    this.io = socketio(this.app);

    this.middlewares();
    this.webSocket();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  webSocket() {
    this.connectedUsers = {};
    this.io.on('connection', socket => {
      const { user_id } = socket.handshake.query;

      this.connectedUsers[user_id] = socket.id;
    });
    this.server.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;

      return next();
    });
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().app;
