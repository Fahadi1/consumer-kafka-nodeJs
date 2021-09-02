const WebSocketServer = require('websocket').server;
const http = require('http');
const kafka = require('kafka-node');

const Consumer = kafka.Consumer,
    client = new kafka.KafkaClient("localhost:2181"),
    consumer = new Consumer(
        client, [{
            topic: 'cmd_mathilda', partition: 0
        }],
        { autoCommit: false }
    );

consumer.on('message', function (message) {
    console.log(message);
});

const server = http.createServer(function (req, res) {
    console.log('request received : ' + req.url);
    res.writeHead(404);
    res.end();
});
server.listen(8181, () => {
    console.log('listening on port : 8181');
});

webSocketServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function isOriginAllowed(origin) {
    return true;
}

webSocketServer.on('request', function (request) {
    if (!isOriginAllowed(request.origin)) {
        request.reject();
        console.log('connection from : ' + request.origin + ' rejected');
        return;
    }

    const connection = request.accept('echo-protocol', request.origin);
    console.log('connection accepted : ' + request.origin);
    connection.on('message', function (message) {
        if (message.type === 'utf-8') {
            console.log('received message : ' + message.utf8Data);
        }
    });

    consumer.on('message', function(message) {
        console.log(message);
        connection.sendUTF(message.value);
    });

    connection.on('close', function (reasonCode, description) {
        console.log('connection ' + connection.remoteAddress + ' disconnected');
    });
});