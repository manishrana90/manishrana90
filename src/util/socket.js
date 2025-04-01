import {io} from 'socket.io-client';

// https://osgnapi.paisaexch.com/
// https://socket.paisaexch.com/
export const Socket = io('https://socket.paisaexch.com/', {
  transports: ['polling'], 
});

Socket.on('connect_error', () => {
  // revert to classic upgrade
  Socket.io.opts.transports = ['polling', 'websocket'];
});

Socket.on('disconnect', () => {
  console.log("Disconnect")
  Socket.emit('connected');
})

Socket.on("connect", () => {
  Socket.sendBuffer = [];
});


// Socket.on('connect_error', () => {
//     // revert to classic upgrade
//     Socket.io.opts.transports = ['polling', 'websocket'];
//   });
  
  // Socket.emit('connected', () => {
  //   console.log('connected');
  // });
  
  // Socket.on('get-status', (...args) => {
  //   console.log(args);
  // });

