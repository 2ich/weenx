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

function arrayRemove(arr, value) { 

    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

rooms = []

rooms.defu = {
    users: [],
    cells: []
}

cwidth = 900
cheight = 600
// canvas.width = cwidth
// canvas.height = cheight

gz = 50
xcells = cwidth / gz
ycells = cheight / gz

console.log(xcells, ycells)

// cl_bg = "#0088ff"
cl_bg = "#fff"
cl_empty = '#f8f8f8'
cl_self = '#141414'
cl_selc = 'orange'

selc = {
    x: 1000,
    y: 1000
} 

sells = []

for (let i = 0; i < ycells; i++) {
    selly = []
    for (let j = 0; j < xcells; j++) {
        selly.push({
            color: cl_empty,
            selected: false,
        })
    }
    sells.push(selly)
}

// cells[3][5].color = 'orange'
sells[2][7].color = 'crimson'

rooms.defu.cells = sells


io.on('connection', (socket) => {
    console.log('new connection', socket.id)

    rooms.defu.users.push(socket.id)
    console.log(rooms)

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected')
        
        rooms.defu.users = arrayRemove(rooms.defu.users, socket.id)
    })

    socket.on('move', (data) => {
        socket.broadcast.emit('move', data)
        console.log(data)
    })

    socket.on('new-player', (cb) => {
        // socket.broadcast.emit({
        //     cells: rooms.defu.cells
        // })
        cb({
            cells: rooms.defu.cells
        })
    })
    // socket.on('new', (data) => {
    //     // console.log(data)
    //     if (!rooms.defu.cells)        
    //         rooms.defu.cells = data.cells
    // })
})




server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
})