import io from 'socket.io-client'

const URL = 'http://localhost:5001/'
var socket;

function initSocket(token){
    socket = io(URL, { query: {"token": token}})
}


export {
    socket,
    initSocket
}
