const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory store
const users = new Map();      // socketId -> { username, avatar, color }
const rooms = new Map();      // roomName -> [{ sender, text, time, id }]
const privateChats = new Map(); // "userA|userB" -> [messages]

function getRoomKey(a, b) {
  return [a, b].sort().join('|');
}

io.on('connection', (socket) => {

  // User joins with username
  socket.on('join', ({ username, color }) => {
    const avatar = username.slice(0, 2).toUpperCase();
    users.set(socket.id, { username, avatar, color, socketId: socket.id });
    socket.username = username;

    // Broadcast updated user list
    io.emit('users', Array.from(users.values()));
    io.emit('system', { text: `${username} qoşuldu`, time: now() });
  });

  // Group room chat
  socket.on('join_room', (room) => {
    socket.join(room);
    if (!rooms.has(room)) rooms.set(room, []);
    const history = rooms.get(room).slice(-50);
    socket.emit('room_history', { room, messages: history });
  });

  socket.on('room_msg', ({ room, text }) => {
    const user = users.get(socket.id);
    if (!user) return;
    const msg = { id: Date.now(), sender: user.username, avatar: user.avatar, color: user.color, text, time: now() };
    if (!rooms.has(room)) rooms.set(room, []);
    rooms.get(room).push(msg);
    io.to(room).emit('room_msg', { room, msg });
  });

  // Private messages
  socket.on('private_msg', ({ toUsername, text }) => {
    const sender = users.get(socket.id);
    if (!sender) return;

    // Find recipient socket
    let recipientSocket = null;
    for (const [sid, u] of users) {
      if (u.username === toUsername) { recipientSocket = sid; break; }
    }

    const key = getRoomKey(sender.username, toUsername);
    if (!privateChats.has(key)) privateChats.set(key, []);
    const msg = { id: Date.now(), sender: sender.username, avatar: sender.avatar, color: sender.color, text, time: now() };
    privateChats.get(key).push(msg);

    // Send to both
    socket.emit('private_msg', { with: toUsername, msg });
    if (recipientSocket) {
      io.to(recipientSocket).emit('private_msg', { with: sender.username, msg });
      io.to(recipientSocket).emit('notification', { from: sender.username, text });
    }
  });

  socket.on('get_private_history', ({ withUsername }) => {
    const me = users.get(socket.id);
    if (!me) return;
    const key = getRoomKey(me.username, withUsername);
    const history = privateChats.get(key) || [];
    socket.emit('private_history', { with: withUsername, messages: history.slice(-50) });
  });

  socket.on('typing', ({ to, isRoom }) => {
    const user = users.get(socket.id);
    if (!user) return;
    if (isRoom) {
      socket.to(to).emit('typing', { from: user.username, room: to });
    } else {
      // find recipient
      for (const [sid, u] of users) {
        if (u.username === to) {
          io.to(sid).emit('typing', { from: user.username, private: true });
          break;
        }
      }
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('users', Array.from(users.values()));
      io.emit('system', { text: `${user.username} ayrıldı`, time: now() });
    }
  });
});

function now() {
  return new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ChatAZ server işləyir: http://localhost:${PORT}`);
});
