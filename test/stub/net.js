import net from 'net';

export default function stub(options = {}) {
  const {
    port = 8888,
      host = 'localhost'
  } = options;

  const original = net.connect;

  function connect() {
    const socket = Reflect.apply(original, net, [{
      host,
      port,
      servername: host
    }]);

    socket.on('connect', () => {
      socket.emit('secureConnect');
    });

    return socket;
  }

  return {
    connect
  };
}
