
const moment = require("moment-timezone");
const {saveCustomerIncomingMessageWebsiteCompanyOnline_, ChatConversations} = require("../utils/chatUtils");

function MessageEventt(io, socket, message, messages, connectionSet, usersList, messagesChatRooms) {
    console.log('messages:MessageEventt:', JSON.stringify(message))
    let messagesArr = [];
    try {
        const withSocketChatRoom = message.session.withSocketChatRoom || message.withSocketChatRoom; // this means that message came from widget or agent only

        const newObjct = {
            userId: message.session.id,
            message: message.message,
            ticket: message.ticket,
            exiting: message.exiting || null,
            destinationId: message.destinationId,
            timeStamp: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        };




      //  console.log('||messagesChatRooms::', messagesChatRooms)
        if (messagesChatRooms[withSocketChatRoom]) {
            let arr = messagesChatRooms[withSocketChatRoom];
            console.log('||messagesChatRooms::arr::', arr)
            arr.push(newObjct);

            messagesChatRooms[withSocketChatRoom] = arr;
            messagesArr = arr;
        }
      //  console.log('||messagesChatRooms::', messagesChatRooms)
        const senderId = message.session.id;

        if(usersList){
            for (let i = 0; i < usersList.length; i++) {
                if(usersList[i].withSocketChatRoom === withSocketChatRoom ){
                    if( usersList[i].lockedChatData ){
                        usersList[i].lockedChatData.messagesArr = messagesArr; // set the tickets data all the time
                        usersList[i].lockedChatData.ticket = message.ticket; // set the tickets data all the time
                    }
                    break;

                }

            }
        }

        if (message.destinationId === 0) {
            // save like this because we still dont have an agent attending to this user
            // this message will not get a reply or the user will not get any reply as the chat is still pending
            try {
                saveCustomerIncomingMessageWebsiteCompanyOnline_(senderId, message.config.companyId, null, message.message);

            } catch (e) {
                console.log(e)
            }
        } else {

            // save to actual conversation table
            let isAgent = message.admin|| 0 ;
            ChatConversations(message.session.id, message.ticket && message.ticket.ticketId ? message.ticket.ticketId : message.ticket.id ? message.ticket.id : 0, message.destinationId, message.message, isAgent)

        }

        socket.messages = messagesArr;

        socket.broadcast.to(message.session.withSocketChatRoom || message.withSocketChatRoom).emit('MESSAGE', {
            method: message.method,
            payload: {
                /* currentUsersOnline: usersList,*/
                user: {
                    userId: socket.userId,
                    messages: messagesArr,
                }
            }
        });
        socket.broadcast.to(message.session.withSocketChatRoom || message.withSocketChatRoom).emit('LISTEN', {
            method: message.method,
            payload: {
                /* currentUsersOnline: usersList,*/
                user: {
                    listen:true,
                    userId: socket.userId,
                    messages: messagesArr,
                }
            }
        });

        console.log('sent messages to group::', message.session.withSocketChatRoom || message.withSocketChatRoom)


        /* const user = getCurrentUser(socket.id);
         console.log('user MESSAGE::1::', user);

         socket.broadcast
             .to(user.withSocketChatRoom)
             .emit('MESSAGE', {
                 user: user,
                 message: message
             });*/

    } catch (e) {
        console.log('error', e);
    }
}


module.exports = MessageEventt;












