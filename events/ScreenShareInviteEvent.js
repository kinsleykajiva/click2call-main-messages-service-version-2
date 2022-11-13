



function ScreenShareInviteEvent(socket,message,connectionSet) {
    console.log('user SCREEN_SHARE_INVITE');
try{
    socket.broadcast.to(message.session.withSocketChatRoom || message.withSocketChatRoom).emit(message.method /*please leave it like so as its a shared method*/, {
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


module.exports = ScreenShareInviteEvent;









