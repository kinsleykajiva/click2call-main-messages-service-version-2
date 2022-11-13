


function CallRejectedEvent(socket,message) {
    console.log('user CALL_REJECTED');


  try {
      socket.broadcast.to(message.session.withSocketChatRoom || message.withSocketChatRoom ).emit("CALL_REJECTED", {
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

module.exports = CallRejectedEvent;