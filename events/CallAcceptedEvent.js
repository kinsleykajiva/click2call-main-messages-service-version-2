



function callAcceptedEvent(socket,message) {
    console.log('user CALL_ACCEPTED' ,message);

    socket.broadcast.to( message.session.withSocketChatRoom  || message.withSocketChatRoom /*make sure you keep the condition as is*/ ).emit("CALL_ACCEPTED", {
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




}



module.exports = callAcceptedEvent;