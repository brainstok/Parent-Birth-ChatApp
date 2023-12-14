import io from 'socket.io-client';

export const socket = io(null, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 500,
  maxReconnectionAttempts: Infinity,
});
