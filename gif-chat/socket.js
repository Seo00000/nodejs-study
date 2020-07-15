const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io); //라우터에서 io 객체를 쓸 수 있게 함
    const room = io.of('/room'); // Socket.io에 네임스페이스를 부여하는 메서드. 같은 네임스페이스끼리만 데이터를 전달함.
    const chat = io.of('/chat');
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/, '');
        socket.join(roomId);
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`,
        });
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {
                axios.delete(`http://localhost:8005/room/${roomId}`)
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                });
            }
        });
    });
    /*
    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect', () => { //연결 끊겼을 때
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => { //에러
            console.error(error);
        });
        socket.on('reply', (data) => { //사용자 정의 이벤트
            console.log(data);
        });
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO'); //이벤트 이름, 인자
        }, 3000);
    });
    */
};


/* const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트의 IP 알아내기
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message);
        });
        ws.on('error', (error) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });
        const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        }, 3000);
        ws.interval = interval;
    });
};
*/