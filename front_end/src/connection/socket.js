import io from 'socket.io-client'

const URL = 'http://localhost:5001/'
var socket = null;

function initSocket(token){
    if(!socket){
        socket = io(URL, { query: {"token": token}})
    }
}


export {
    socket,
    initSocket
}
