// Connect to the Socket.io server
const socket = io('http://localhost:8080');

// Select elements from the DOM
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

// Function to append messages to the chat container
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // Clear input field after sending
});

// Prompt user for name and emit 'new-user-joined' event
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Event listeners for incoming messages and user activity
socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    appendMessage(`${name} left the chat`, 'left');
});
