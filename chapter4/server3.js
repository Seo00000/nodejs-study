const http = require('http');

const parseCookies = (cookie ='') => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')]) //js es6 Spread 연산자 => Iterable Object(열거 가능한 오브젝트)를 하나씩 전개, 변수 앞에 ...을 찍어 선언한다.
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

//해당 parseCookies 함수는 쿠키를 객체로 바꿔주는 역할을 한다. name=test; => { name: 'test' }

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies); //주소의 path와 search 부분을 알려줌
    res.writeHead(200, {'Set-Cookie' : 'mycookie=test'}); //쿠키 기록
    res.end('Hello Cookie');
})
.listen(8082, () => {
    console.log('8082번 포트에서 대기 중입니다!');
});