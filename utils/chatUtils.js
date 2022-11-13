const axios = require("axios");
require('dotenv').config();
// let API_BASE_URL = process.env.DEV_NODE_ENVIROMMENT ? 'https://api-chat-messages.xxxxxxxxx.com' : 'http://localhost:3300';
let API_BASE_URL = 'https://api-chat-messages.xxxxxxxxx.com'

let opsys = process.platform;

if (opsys == "darwin") {
    opsys = "MacOS";
} else if (opsys == "win32" || opsys == "win64") {
    opsys = "Windows";
    API_BASE_URL = 'http://localhost:3300';
} else if (opsys == "linux") {
    opsys = "Linux";
}
console.log(opsys) // I don't know what linux is.

function updateCustomerIncomingMessageWebsiteCompanyOnline_(senderId, handledByUserId,ticketObjj) {
    console.log('updateCustomerIncomingMessageWebsiteCompanyOnline_');
    try {


        axios.post(API_BASE_URL + '/api/v1/conversation/updateCustomerIncomingMessageWebsiteCompanyOnline', {
            senderId: senderId,
            handledByUserId: handledByUserId ,
            ticketObjj
        });
    } catch (e) {
        console.log(e);
    }

}

function saveCustomerIncomingMessageWebsiteCompanyOnline_(senderId, companyId, handledByUserId, content) {
    console.log('saveCustomerIncomingMessageWebsiteCompanyOnline_');
    try {

        handledByUserId = handledByUserId || 0;

        axios.post(API_BASE_URL + '/api/v1/conversation/saveCustomerIncomingMessageWebsiteCompanyOnline', {
            senderId, companyId, handledByUserId, content
        });


    } catch (e) {
        console.log(e);
    }

}


function ChatConversations(senderId, ticketId, recipientId, content, isAgent) {
    console.log('ChatConversations :ticketId' + ticketId);
    console.log('ChatConversations :senderId' + senderId);
    console.log('ChatConversations :recipientId' + recipientId);
    try {
        axios.post(API_BASE_URL + '/api/v1/conversation/chatconversations', {
            senderId, ticketId, recipientId, content, isAgent
        });
    } catch (e) {
        console.log(e);

    }


}


module.exports = {
    saveCustomerIncomingMessageWebsiteCompanyOnline_,
    updateCustomerIncomingMessageWebsiteCompanyOnline_,
    ChatConversations
}
