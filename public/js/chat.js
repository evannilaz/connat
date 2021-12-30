const socket = io();

socket.on('message', (message) => {
  bubbleList.innerHTML += _.formatMessage(message);
});

chatForm.addEventListener('submit', (event) => {
  socket.emit('sendMessage', chatInput.value);
});