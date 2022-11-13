function EndedCallEvent(socket, message) {
    console.log('user ENDED_CALL',message);

    try {
        socket.broadcast.to(message.session.withSocketChatRoom  || message.withSocketChatRoom).emit("ENDED_CALL", {
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
    } catch (e) {
        console.log(e);
    }


}


module.exports = EndedCallEvent;



















