import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function subscribeToDonorList(cb) {
  socket.on('newDonor', newDonor => cb(null, newDonor));
  socket.emit('subscribeToDonorEasy', '127.0.0.1');
}

function sendNewDonorId(id) {
  //socket.on('newDonor', newDonor => cb(null, newDonor));
  socket.emit('i-have-new-donor', id);
}

export { subscribeToTimer, subscribeToDonorList, sendNewDonorId }
