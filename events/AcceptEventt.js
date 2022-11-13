const {updateCustomerIncomingMessageWebsiteCompanyOnline_} = require("../utils/chatUtils");
const moment = require("moment-timezone");


function JOIN_TO_LISTEN_EVENTEvent(io,socket,message,messages,connectionSet,usersList) {


    console.log('user JOIN_TO_LISTEN_EVENTEvent');

    socket.join(message.withSocketChatRoom);

}
function AcceptEvent(io,socket,message,messages,connectionSet,usersList) {
    console.log('user ACCEPT');

    function findTicketInfo (userId){
        if(userId === null || userId === undefined){
            console.log('no ticket info:: ' + userId);
            return null;
        }
       // console.log('usersList info:: ' + usersList);
       //  console.log(JSON.stringify(usersList, null, 4));

        if(usersList.length > 0){
            let resul =  usersList
                .filter(x=> x.lockedChatData )
                .filter(x=>x.lockedChatData.lockedByAgentId === userId)
                .map(x=>{ console.log(' ticket info ' + userId); return x.lockedChatData.ticket;});
            if(!resul){
                return null;
            }
            if (Array.isArray(resul) ) {
               return  resul[0];
            }
            return  resul;

        }
console.log('no ticket info ' + userId);
        return null;

    }

   try{
       messages.forEach(message_ => {
           if (message_.userId === message.targetUser) {
               message_.destinationId = message.admin; // setting destinations to all messages
           }

       });
       const ticketObjj = message.ticketObj || findTicketInfo(message.admin);

       updateCustomerIncomingMessageWebsiteCompanyOnline_(message.targetUser, message.admin, ticketObjj);//

       if(message.withSocketChatRoom){// this is an event from the agent side  only
           socket.join(message.withSocketChatRoom);

           socket.broadcast.to(message.withSocketChatRoom).emit('ACCEPT', {
               method: message.method,
               payload: {
                   user: {
                       ticket:ticketObjj,
                       destinationId: message.admin,
                       fullName: message.session.fullName,
                       profilePicture: message.session.profilePicture
                   }
               }
           });
           //let notify other client agents that the user is online that the widget user hsa been locked .
           const lockData = {
               lockedByAgentName:message.session.fullName,
               profilePicture:message.session.profilePicture,
               lockedByAgentId:message.admin,
               lockedRoom:message.withSocketChatRoom,
               ticket:message.ticketObj || findTicketInfo(message.admin),
               messagesArr:[] ,
               timeStamp: moment.utc().format('YYYY-MM-DD HH:mm:ss')
           };
           socket.broadcast.emit('NOTIFY_OTHER_AGENTS',lockData);
           // socket.emit('NOTIFY_OTHER_AGENTS',lockData);
           if(usersList){
               for (let i = 0; i < usersList.length; i++) {
                   if(usersList[i].withSocketChatRoom === message.withSocketChatRoom){
                       usersList[i].lockedChatData = lockData;
                       break;

                   }

               }
           }
       }



      /* connectionSet.forEach(clients => {

           if (!clients.admin && clients.userId === message.targetUser) {
               clients.destinationId = message.admin;

               // send only to agent
               clients.send(JSON.stringify({
                   method: message.method,
                   payload: {
                       user: {
                           destinationId: message.admin,
                           fullName: message.session.fullName
                       }
                   }
               }));
           }

           if (clients.admin && clients.admin !== message.admin) { // dont emit this back to the admin that had accept this ticket
               clients.send(JSON.stringify({
                   method: message.method,
                   payload: {
                       user: {
                           takenByAdminId: message.admin,
                           takenUser: message.targetUser,
                           takenByAdmin: message.session.fullName,
                       }
                   }
               }));
           }

       });*/
   }catch (e) {

       console.error(e);
   }



}


module.exports = {AcceptEvent,JOIN_TO_LISTEN_EVENTEvent};