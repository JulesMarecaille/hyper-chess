import io from 'socket.io-client'
import config from '../config'

var socket = null;

function initSocket(token){
    if(!socket){
        socket = io(config.socket_url, { query: {"token": token}})
    }
}


export {
    socket,
    initSocket
}
