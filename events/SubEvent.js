


function SubEvent(io, socket, message, messages, connectionSet, usersList, messagesChatRooms) {
    if (message.admin) {
        message.session.admin = message.admin;
        socket.admin = message.admin;// if from widget then this is null or does not exist
    }

    let wasFound = false;
    for(let i = 0; i < usersList.length; i++){
        if(usersList[i].id === message.session.id){
            usersList[i] = message.session;
            wasFound = true;
            break
        }
    }
    if(!wasFound){
        usersList.push(message.session);
    }




    // usersList = [...new Set(usersList)];// remove duplicates
 //   socket.id = message.session.id;
    socket.userId = message.session.id;
    socket.fullName = message.session.fullName;


    /// const ids = usersList.map(o => o.id)
    // usersList = usersList.filter(({id}, index) => !ids.includes(id, index + 1)); // remove duplicates


    console.log('info', 'XXXXusersList-', usersList)
    console.log('info', 'XXXX-', message)

    for (let i = 0; i < connectionSet.length; i++) {
        let clients = connectionSet[i];
        usersList.forEach(user => {
            if (!clients.userId) {
                clients.userId = user.id;
                if (user.admin) {
                    clients.admin = user.admin; // this means connection is for agents
                }

            }
        })
        connectionSet[i] = clients;
    }

    const withSocketChatRoom = message.withSocketChatRoom;
    if(withSocketChatRoom){
        if(!messagesChatRooms[withSocketChatRoom]){
            messagesChatRooms[withSocketChatRoom] = [];
        }
    }



    console.log('messagesChatRooms::',withSocketChatRoom, messagesChatRooms[withSocketChatRoom]);

    const messageObj = {
        method: message.method,
        payload: {
            currentUsersOnline: usersList,
            user: {
                userId: message.session.id,
                messages: messages,
            }
        }
    }
    console.log('tttt::::', messageObj);

    if (!message.admin) {
        // this is the widget user
       // console.log('remembering]==========]', message.remembering)
        socket.join(withSocketChatRoom);
        if(!message.remembering) {
          //  console.log('rememberingNNNNNNNNNNNNN]', message.remembering)
            socket.broadcast.to(withSocketChatRoom).emit('SUB', messageObj);
        }
        //   io.emit('SUB_AGENTS', messageObj);
    }else{
        // this is the admin user sending back to self to remember
       // io.emit('AGENT_SUB', messageObj);
        console.log('AGENT_SUB]==========]', messageObj)
        socket.emit('AGENT_SUB', messageObj);
    }
    if(messagesChatRooms[withSocketChatRoom]){
        io.to(message.session.id).emit('REMEMBER',messagesChatRooms[withSocketChatRoom]);
    }



    //messageObj.method = 'SUB_AGENTS';
    if(!message.remembering) {// if not remembering then dont send anything to anyone
      //  console.log('remembering]]]]]]]]]', message.remembering)

        socket.broadcast.emit(messageObj.method, messageObj);// sending to all clients except sender
        // io.to(WIDGET_API_KEY).emit('SUB_AGENTS', messageObj);
        // socket.broadcast.to(WIDGET_API_KEY).emit('SUB_AGENTS', messageObj);
    }
  //  console.log(';;;;;;;;;;;;;;;;;llllll')
}


module.exports = SubEvent;