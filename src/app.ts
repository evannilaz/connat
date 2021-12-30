import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import http = require('http');
import { Server } from 'socket.io';

import _ = require('./lib/_');
import session = require('./lib/session');
import account = require('./router/account');
import channel = require('./router/channel');

const app: express.Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(session());
app.use(express.static('./public'));
app.use('/account', account);
app.use('/channel', channel);

app.get('*', (req: any, res: express.Response, next: express.NextFunction) => {
  req.session.un ? next() : res.redirect('/account/signin');
});

app.get('/', (req: express.Request, res: express.Response) => {
  _.send('app', { res });
});

io.on('connection', (socket) => {
  socket.broadcast.emit('message', {
    isSelf: false,
    un: 'ADMIN',
    text: 'Welcome to Connat!',
    time: _.getDate()
  });
});

server.listen(80, () => {
  console.log('Server running on http://localhost:80')
});