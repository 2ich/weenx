const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const port = process.env.PORT || 5000;

console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
console.log(process.env)

app.use('/server-assets', express.static(__dirname + '/assets'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


io.on('connection', (socket) => {
    console.log('new connection', socket.id)

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected')
    })

    socket.on('move', (data) => {
        socket.broadcast.emit('move', data)
        console.log(data)
    })
})




server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
})