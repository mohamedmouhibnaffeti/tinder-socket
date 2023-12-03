const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let activeUsers = []

io.on("connection", (socket)=>{
    //add new user
    socket.on('new-user-add', (newUserEmail)=>{
        if(!activeUsers.some((user)=>user.user.email === newUserEmail)){
            activeUsers.push({
                userEmail: newUserEmail,
                socketId: socket.id
            })
        }
        console.log('Connected users :>> ', activeUsers);
        io.emit('get-users', activeUsers)
    })
    socket.on('disconnect', ()=>{
        activeUsers = activeUsers.filter((user)=>user.socketId !== socket.id)
        console.log("user disconnected...", activeUsers)
        io.emit('get-users', activeUsers)
    })
})