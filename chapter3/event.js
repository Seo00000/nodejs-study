const EventEmitter = require('events');

const myEvent = new EventEmitter();
myEvent.addListener('event1', () => { //on과 같은 기능
    console.log('이벤트 1');
});
myEvent.on('event2', () => { //(이벤트명, 콜백) | 이벤트 이름과 이벤트 발생 시의 콜백을 연결해줌
    console.log('이벤트 2');
});
myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
});

myEvent.emit('event1'); //(이벤트명) | 이벤트 호출 메서드
myEvent.emit('event2');

myEvent.once('event3', () => { //(이벤트명, 콜백) | 한 번만 실행되는 이벤트, 여러번 호출해도 골백은 한 번만!
    console.log('이벤트 3');
});
myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('event4', () => {
    console.log('이벤트 4');
});
myEvent.removeAllListeners('event4'); //(이벤트명) | 이벤트에 연결된 모든 이벤트 리스너를 제거
myEvent.emit('event4');

const listener = () => {
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener); //(이벤트명, 리스너)| 이벤트에 연결된 리스너를 하나씩 제거
//off(이벤트명, 콜백) | 노드 10 버전에서 추가된 메서드로, removeListener와 같은 기능.
myEvent.emit('event5');

console.log(myEvent.listenerCount('event2'));
