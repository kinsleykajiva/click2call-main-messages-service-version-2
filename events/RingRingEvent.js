


function  RingRingEvent(socket,message ,connectionSet) {
    console.log('user RING_RING' ,message);
try{
    socket.broadcast.to(message.session.withSocketChatRoom || message.withSocketChatRoom ).emit("RING_RING", {
        method: message.method,
        payload: {
            /* currentUsersOnline: usersList,*/
            user: {
                destinationId: message.destinationId,
                room: message.room,
                fullName: message.session.fullName
            }
        }
    });
}catch (e) {
    console.log(e);
}






}


module.exports = RingRingEvent;



















