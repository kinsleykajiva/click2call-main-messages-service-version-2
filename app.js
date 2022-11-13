#!/usr/bin/env node
const express  = require('express');
const {normalizePort, getNameSpacesList, saveClientConnection} = require("./utils/utils");

const SubEvent = require("./events/SubEvent");
const ScreenShareInviteEvent = require("./events/ScreenShareInviteEvent");
const CloseExitEvent = require("./events/CloseExitEvent");
const callAcceptedEvent = require("./events/CallAcceptedEvent");
const CallRejectedEvent = require("./events/CallRejectedEvent");
const EndedCallEvent = require("./events/EndedCallEvent");
const RingRingEvent = require("./events/RingRingEvent");
const MessageEventt = require("./events/MessageEvent");

const {AcceptEvent,JOIN_TO_LISTEN_EVENTEvent} = require("./events/AcceptEventt");

const app = express();

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "",

    });
});

router.get('/health', (req, res) => {
    return res.json({
        success: true,
        message: "",

    });
});

app.use( router);

const http = require('http').Server(app);
const io = require('socket.io')(http,  { cors: { origin: '*' } });

require('dotenv').config();
const port = normalizePort(process.env.PORT);
let usersList = new Map();
let connectionSet = new Map();
let messages = new Map();
let messagesChatRooms = new Map();
// let messagesChatRooms = {};
async function run() {
    const nameSpace = await getNameSpacesList();

    nameSpace.forEach(name => {

        usersList.set(name,[]);
        connectionSet.set(name,[]);
        messages.set(name,[]);
        messagesChatRooms.set(name,{});
        //messagesChatRooms
        io.of(name).on('connection', (socket) => {

          //  let usersList = [];
            console.log('a user connected');
            console.log(socket.handshake.query['key']);
            try {

                const key = (socket.handshake.query['key']);
                const domain = (socket.handshake.query['domain']);
                const isWidget = (socket.handshake.query['isWidget']);

                connectionSet.set(name, [socket]);
             //   messagesChatRooms[name] = {};

                if (domain || isWidget) {
                    console.log("domain", name, domain, '0', isWidget);
                    saveClientConnection(name, domain, '0', isWidget)
                }
            } catch (e) {
                console.error(e);
            }

            socket.on('SUB', (message) => SubEvent(io,socket, message,messages.get(name),connectionSet.get(name),usersList.get(name) , messagesChatRooms.get(name) ));

            socket.on('SCREEN_SHARE_INVITE', message => ScreenShareInviteEvent(socket, message ,connectionSet.get(name)));

            socket.on('SCREEN_SHARE_ACCEPTED', message => ScreenShareInviteEvent(socket, message ,connectionSet.get(name)));

            socket.on('SCREEN_SHARE_REJECTED', message => ScreenShareInviteEvent(socket, message ,connectionSet.get(name)));

            socket.on('CLOSE_EXIT', message => CloseExitEvent(socket, message));

            socket.on('CALL_ACCEPTED', message => callAcceptedEvent(socket, message));

            socket.on('CALL_REJECTED', message => CallRejectedEvent(socket, message));

            socket.on('ENDED_CALL', message => EndedCallEvent(socket, message,connectionSet.get(name)));

            socket.on('RING_RING', message => RingRingEvent(socket, message,connectionSet.get(name)));

            socket.on('MESSAGE', message => MessageEventt(io,socket, message,messages.get(name),connectionSet.get(name),usersList.get(name) , messagesChatRooms.get(name)));

            socket.on('ACCEPT', message => AcceptEvent(io,socket, message,messages.get(name),connectionSet.get(name),usersList.get(name)));
            socket.on('LISTEN', message => JOIN_TO_LISTEN_EVENTEvent(io,socket, message,messages.get(name),connectionSet.get(name),usersList.get(name)));

            socket.on('disconnect', () => {
                console.log('user disconnected');
                try {
                    connectionSet.get(name).splice(connectionSet.get(name).indexOf(socket), 1);
                }catch (e) {
                    console.log(e);
                }


            });
        });
    });

}
run();
io.listen(port);