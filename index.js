const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// Use a shared variable accessible across different socket events
let activeUsers = [];

io.on("connection", (socket) => {
    // add new user
    socket.on('new-user-add', (newUserEmail) => {
        if (!activeUsers.some((user) => user.email === newUserEmail)) {
            activeUsers.push({
                email: newUserEmail,
                socketId: socket.id
            });
        }
        io.emit('get-users', activeUsers);
    });

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("user disconnected...", activeUsers);
        io.emit('get-users', activeUsers);
    });

    socket.on('send-message', (data) => {
        const receiverEmail = data.receiverEmail;
        const sender = data.sender
        const user = activeUsers.find((user) => user.email === receiverEmail);
        const senderUser = activeUsers.find((user) => user.email === sender);
        if(senderUser){
            io.to(senderUser.socketId).emit("receive-message", data);
        }
        console.log(data);
        if (user) {
            io.to(user.socketId).emit("receive-message", data);
            console.log(activeUsers);
        }
    });
});
