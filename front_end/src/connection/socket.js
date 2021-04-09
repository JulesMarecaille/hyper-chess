import io from 'socket.io-client'

var socket = null;

function initSocket(token){
    if(!socket){
        socket = io(process.env.SOCKET_SERVER_URL, { query: {"token": token}})
    }
}


export {
    socket,
    initSocket
}
